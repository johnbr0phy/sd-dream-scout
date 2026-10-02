#!/usr/bin/env node
/**
 * Build one trip-day time capsule.
 *
 *   node scripts/build-capsule.mjs 2026-10-01
 *   node scripts/build-capsule.mjs --all
 *
 * Reads index.html for that day's timeline and grocery card, merges those
 * two fields into capsules/<date>.json, and does not touch notes or houses.
 * Renders capsules/<date>.html from capsules/template.html, then refreshes
 * capsules/index.html.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const capsuleDir = path.join(root, 'capsules');
const templatePath = path.join(capsuleDir, 'template.html');
const tripPath = path.join(root, 'index.html');

const DAYS = {
  '2026-09-30': { id: 'wed', label: 'Wed', heading: 'Wed 30 Sep' },
  '2026-10-01': { id: 'thu', label: 'Thu', heading: 'Thu 1 Oct' },
  '2026-10-02': { id: 'fri', label: 'Fri', heading: 'Fri 2 Oct' },
  '2026-10-03': { id: 'sat', label: 'Sat', heading: 'Sat 3 Oct' },
  '2026-10-04': { id: 'sun', label: 'Sun', heading: 'Sun 4 Oct' },
};

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function squash(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

function money(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return esc(amount ?? '');
  if (amount % 1000 === 0) return `$${amount / 1000}K`;
  return `$${amount.toLocaleString('en-US')}`;
}

function loadTrip() {
  return cheerio.load(fs.readFileSync(tripPath, 'utf8'));
}

function extractTimeline($, dayId) {
  const section = $(`#${dayId}`);
  if (!section.length) throw new Error(`No #${dayId} section in index.html`);
  const items = [];
  section.find('ul.timeline').first().children('li').each((_, li) => {
    const node = $(li);
    const timeEl = node.find('.tl-time').first().clone();
    const range = squash(timeEl.find('.range').text());
    timeEl.find('.range').remove();
    const clock = squash(timeEl.text());
    items.push({
      time: [clock, range].filter(Boolean).join(' '),
      title: squash(node.find('.tl-title').text()),
      detail: squash(node.find('.tl-detail').text()),
    });
  });
  if (!items.length) throw new Error(`No timeline items in #${dayId}`);
  return items;
}

function mapsQuery(href) {
  if (!href) return '';
  try {
    const url = new URL(href, 'https://maps.google.com');
    return url.searchParams.get('q') || '';
  } catch {
    return '';
  }
}

function extractGroceries($, day, town) {
  const cards = $('#groceries .card').toArray().filter((card) => {
    const label = squash($(card).find('.k').text());
    return label.includes(day.label) || (town && label.toLowerCase().includes(town.toLowerCase()));
  });
  if (cards.length !== 1) {
    throw new Error(`Expected one grocery card for ${day.label}, found ${cards.length}`);
  }
  const card = $(cards[0]);
  const primaryLink = card.find('.v a').first();
  const altLink = card.find('.s a').first();
  const mapsLink = card.find('.s a').filter((_, anchor) => (
    /maps\.google|google\.com\/maps|maps\.app\.goo/.test($(anchor).attr('href') || '')
  )).first();
  const primaryName = squash(primaryLink.text());
  const primaryAddress = squash(card.find('.v').text())
    .replace(primaryName, '')
    .replace(/^[\s·|:–-]+/, '')
    .trim();
  const altText = squash(altLink.text()).replace(/^Alt:\s*/i, '');
  const altParts = altText.split('·').map((part) => part.trim()).filter(Boolean);
  const fromMaps = mapsQuery(mapsLink.attr('href'));
  return {
    primary: {
      name: primaryName,
      address: primaryAddress,
      link: primaryLink.attr('href') || '',
    },
    alt: {
      name: altParts[0] || altText,
      address: fromMaps || altParts.slice(1).join(', '),
      link: altLink.attr('href') || '',
    },
  };
}

function statLine(house) {
  const bits = [];
  if (house.yearBuilt) bits.push(String(house.yearBuilt));
  if (house.beds != null) bits.push(`${house.beds} bed`);
  if (house.baths != null) bits.push(`${house.baths} bath`);
  if (house.sqft != null) bits.push(`${Number(house.sqft).toLocaleString('en-US')} sq ft`);
  if (house.hoa) bits.push(`HOA ${house.hoa}`);
  if (house.mls) bits.push(`MLS ${house.mls}`);
  return bits.join(' · ');
}

function photoBlock(photo) {
  if (!photo) return '';
  const source = photo.sourceUrl
    ? `<a href="${esc(photo.sourceUrl)}" rel="noopener" target="_blank">Listing page</a>`
    : '';
  if (photo.kind === 'listing') {
    const img = photo.url
      ? `<div class="house-photo"><img src="${esc(photo.url)}" alt="Listing photo" referrerpolicy="no-referrer"></div>`
      : '';
    const view = photo.sourceUrl
      ? `<a href="${esc(photo.sourceUrl)}" rel="noopener" target="_blank">View listing photos</a>`
      : '';
    return `${img}<p class="small">${view}${view && source ? ' · ' : ''}${source}${photo.credit ? `<br>${esc(photo.credit)}` : ''}</p>`;
  }
  if (photo.kind === 'streetview') {
    const href = photo.url || photo.sourceUrl;
    return `<p><a href="${esc(href)}" rel="noopener" target="_blank">Open Google Street View for this address</a></p>`;
  }
  const img = photo.url
    ? `<div class="house-photo"><img src="${esc(photo.url)}" alt="Representative house exterior, not this house"></div>`
    : '';
  return `<p><span class="rep-flag">Representative, not this house</span></p>${img}<p class="small">${esc(photo.credit || '')}${photo.sourceUrl ? ` · <a href="${esc(photo.sourceUrl)}" rel="noopener" target="_blank">Photo source</a>` : ''}</p>`;
}

function scoreLine(ranking) {
  if (!ranking || ranking.johnScore == null || ranking.johnScore === '') return 'No score given';
  const scale = ranking.scoreScale || '';
  const source = ranking.scoreSource ? ` · ${esc(ranking.scoreSource)}` : '';
  return `${esc(ranking.johnScore)}${esc(scale)}${source}`;
}

function orderLine(ranking) {
  if (!ranking || !ranking.dayGroup) return '';
  const order = ranking.dayOrder == null
    ? 'No order within this group'
    : `Day order ${esc(ranking.dayOrder)}`;
  const source = ranking.orderSource ? `<br><span class="small">${esc(ranking.orderSource)}</span>` : '';
  return `${order}${source}`;
}

function showingMinutes(time) {
  const match = String(time || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(match[2]);
}

function renderBody(data, day) {
  const timeline = (data.plannedTimeline || []).map((item) => `
    <li>
      <div class="tl-time">${esc(item.time)}</div>
      <div>
        <div class="tl-title">${esc(item.title)}</div>
        <div class="tl-detail">${esc(item.detail)}</div>
      </div>
    </li>`).join('');

  const g = data.groceries || {};
  const groceries = `
    <div class="card">
      <div class="k">Primary</div>
      <p><a href="${esc(g.primary?.link || '')}" rel="noopener">${esc(g.primary?.name)}</a></p>
      <p class="small">${esc(g.primary?.address)}</p>
    </div>
    <div class="card">
      <div class="k">Alt</div>
      <p><a href="${esc(g.alt?.link || '')}" rel="noopener">${esc(g.alt?.name)}</a></p>
      <p class="small">${esc(g.alt?.address)}</p>
    </div>`;

  const food = (data.food || []).map((stop) => `
    <div class="card">
      <h3><a href="${esc(stop.mapsLink)}" rel="noopener" target="_blank">${esc(stop.name)}</a></h3>
      <p class="small">${esc(stop.note)}</p>
    </div>`).join('');

  const notes = data.notes || {};
  const highlights = (notes.highlights || []).map((line) => `<li>${esc(line)}</li>`).join('');
  const nextText = (notes.nextSteps || []).join(' ');
  const sources = (notes.sources || []).map((line) => `<li>${esc(line)}</li>`).join('');

  const groups = [];
  for (const house of data.houses || []) {
    const name = house.ranking?.dayGroup || '';
    const last = groups[groups.length - 1];
    if (!last || last.name !== name) groups.push({ name, houses: [house] });
    else last.houses.push(house);
  }
  const houses = groups.map((group) => {
    const label = group.name || 'No ranking yet';
    const cards = group.houses.map((house) => {
      const tone = group.name === 'Standout' ? ' pick' : group.name === 'Worst of the day' ? ' low' : '';
      const facts = statLine(house);
      const when = house.showingTime ? `<p class="small">Showing ${esc(house.showingTime)}</p>` : '';
      const matched = house.matchSource ? `<p class="small">${esc(house.matchSource)}</p>` : '';
      return `
        <article class="card${tone}">
          <div class="k">${esc(label)}</div>
          <h3>${esc(house.address)}</h3>
          ${when}
          <p class="price">${money(house.price)}</p>
          ${facts ? `<p class="small">${esc(facts)}</p>` : ''}
          ${photoBlock(house.photo)}
          <p><strong>${scoreLine(house.ranking)}</strong></p>
          <p>${orderLine(house.ranking)}</p>
          <p>${esc(house.notes)}</p>
          ${matched}
        </article>`;
    }).join('');
    const heading = group.name ? `<h3 style="margin:18px 0 8px;">${esc(group.name)}</h3>` : '';
    return `${heading}${cards}`;
  }).join('');

  const showings = [...(data.houses || [])]
    .filter((house) => house.showingTime)
    .sort((a, b) => showingMinutes(a.showingTime) - showingMinutes(b.showingTime))
    .map((house) => `
    <li>
      <div class="tl-time">${esc(house.showingTime)}</div>
      <div>
        <div class="tl-title">${esc(house.address)}</div>
        <div class="tl-detail">${esc([money(house.price), house.ranking?.dayGroup].filter(Boolean).join(' · '))}</div>
      </div>
    </li>`).join('');

  return `
    <p class="lede">${esc(data.takeaway || '')}</p>
    <div class="section-title"><h2>Notes</h2><span class="date">${esc(day.heading)}</span></div>
    <p>${esc(notes.summary || '')}</p>
    <ul class="clean">${highlights}</ul>
    <div class="note"><strong>Next.</strong> ${esc(nextText) || 'Nothing recorded.'}</div>
    <div class="section-title"><h2>Showings</h2><span class="date">by appointment time</span></div>
    <ul class="timeline">${showings || ''}</ul>
    <div class="section-title"><h2>Houses</h2><span class="date">${(data.houses || []).some((house) => house.ranking?.dayGroup) ? 'same ranking groups' : 'no rankings yet'}</span></div>
    ${houses || '<p class="lede">No houses recorded.</p>'}
    <div class="section-title"><h2>Food</h2></div>
    ${food || '<p class="lede">No food stops recorded.</p>'}
    <div class="section-title"><h2>Where you'd buy food</h2></div>
    ${groceries}
    <div class="section-title"><h2>Planned timeline</h2><span class="date">from the trip page</span></div>
    <ul class="timeline">${timeline}</ul>
    <div class="section-title"><h2>Sources</h2></div>
    <ul class="clean">${sources}</ul>`;
}

function renderDay(data) {
  const day = DAYS[data.date];
  if (!day) throw new Error(`No trip section mapped for ${data.date}`);
  const $ = cheerio.load(fs.readFileSync(templatePath, 'utf8'));
  const title = `${day.heading} · ${data.town}`;
  $('title').text(`${title} · time capsule`);
  $('#cap-title').text(title);
  $('#cap-sub').text('Time capsule · this trip only · Wed 30 Sep – Sun 4 Oct 2026');
  $('#cap-nav').html(
    `<a href="./">All capsules</a> <a href="../index.html#${day.id}">${esc(day.heading)} on the trip page</a>`
  );
  $('#cap-template-note').remove();
  $('#cap-body').html(renderBody(data, day));
  const out = path.join(capsuleDir, `${data.date}.html`);
  fs.writeFileSync(out, $.html());
  return out;
}

function capsuleFiles() {
  return fs.readdirSync(capsuleDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();
}

function renderIndex() {
  const $ = cheerio.load(fs.readFileSync(templatePath, 'utf8'));
  $('title').text('Time capsules · North County dream scout');
  $('#cap-title').text('Time capsules');
  $('#cap-sub').text('This trip only · Wed 30 Sep – Sun 4 Oct 2026');
  $('#cap-nav').html('<a href="../index.html">Trip page</a>');
  $('#cap-template-note').remove();
  const cards = capsuleFiles().map((name) => {
    const data = JSON.parse(fs.readFileSync(path.join(capsuleDir, name), 'utf8'));
    const day = DAYS[data.date];
    const when = day ? day.heading : data.date;
    const count = (data.houses || []).length;
    return `
      <li><a class="card" href="${esc(data.date)}.html">
        <div class="k">${esc(when)}</div>
        <h3>${esc(data.town || 'Trip day')}</h3>
        <p>${esc(data.takeaway || '')}</p>
        <p class="small">${count} house${count === 1 ? '' : 's'} recorded</p>
      </a></li>`;
  }).join('');
  $('#cap-body').html(`
    <p class="lede">One page per day, built from the trip plan plus the notes for that day. Houses keep the order they were given. A blank score means no score was given.</p>
    <ul class="index-list">${cards || '<li><p>No capsules yet.</p></li>'}</ul>`);
  fs.writeFileSync(path.join(capsuleDir, 'index.html'), $.html());
}

function buildOne(date, trip) {
  const day = DAYS[date];
  if (!day) {
    throw new Error(`Date ${date} is outside this trip. Use one of: ${Object.keys(DAYS).join(', ')}`);
  }
  const jsonPath = path.join(capsuleDir, `${date}.json`);
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Missing ${path.relative(root, jsonPath)}. Create it first (see capsules/README.md).`);
  }
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const notes = data.notes;
  const houses = data.houses;
  const food = data.food;
  const takeaway = data.takeaway;
  const town = data.town;
  data.date = date;
  data.plannedTimeline = extractTimeline(trip, day.id);
  data.groceries = extractGroceries(trip, day, town);
  data.notes = notes;
  data.houses = houses;
  data.food = food;
  data.takeaway = takeaway;
  data.town = town;
  fs.writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`);
  const htmlPath = renderDay(data);
  return { jsonPath, htmlPath, timeline: data.plannedTimeline.length, houses: (houses || []).length };
}

function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/build-capsule.mjs <YYYY-MM-DD> | --all');
    process.exit(1);
  }
  const trip = loadTrip();
  const dates = arg === '--all'
    ? capsuleFiles().map((name) => name.replace(/\.json$/, ''))
    : [arg];
  if (!dates.length) throw new Error('No capsule JSON files to build.');
  for (const date of dates) {
    const result = buildOne(date, trip);
    console.log(`Built ${path.relative(root, result.htmlPath)} (${result.timeline} timeline items, ${result.houses} houses kept)`);
  }
  renderIndex();
  console.log('Built capsules/index.html');
}

main();
