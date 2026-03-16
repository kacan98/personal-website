#!/usr/bin/env node

const ORIGIN = process.env.LINK_CHECK_ORIGIN || 'http://127.0.0.1:4321';
const DEFAULT_PAGES = [
  '/en',
  '/en/about',
  '/en/cv',
  '/en/projects',
  '/da',
  '/da/cv',
  '/sv',
  '/sv/cv',
];

const pages = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_PAGES;
const attrRegex = /(?:href|src)=["']([^"'#]+)["']/g;
const skipPrefixes = ['/__nextjs', '/_next/', '/images/', '/favicon', '/icon?'];

function normalizePath(raw) {
  if (!raw) return null;
  if (raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) return null;
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    if (raw.startsWith(ORIGIN)) {
      const trimmed = raw.slice(ORIGIN.length);
      return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    }
    return null;
  }
  if (raw.startsWith('/')) return raw;
  return null;
}

async function fetchText(path) {
  const res = await fetch(`${ORIGIN}${path}`);
  const text = await res.text();
  return { status: res.status, text };
}

(async () => {
  const malformed = [];
  const discovered = new Set();
  const checkedPages = [];

  for (const page of pages) {
    const { status, text } = await fetchText(page);
    checkedPages.push({ page, status });
    if (status >= 400) continue;

    let match;
    while ((match = attrRegex.exec(text))) {
      const raw = match[1];
      if (/^https?:\/\/(en|da|sv)(?:\/|$)/.test(raw) || /^https?:\/\/(en|da|sv)\b/.test(raw)) {
        malformed.push({ page, url: raw });
      }
      const normalized = normalizePath(raw);
      if (!normalized) continue;
      if (skipPrefixes.some((prefix) => normalized.startsWith(prefix))) continue;
      discovered.add(normalized);
    }
  }

  const results = [];
  for (const path of [...discovered].sort()) {
    try {
      const res = await fetch(`${ORIGIN}${path}`, { redirect: 'manual' });
      results.push({ path, status: res.status, location: res.headers.get('location') || '' });
    } catch (error) {
      results.push({ path, status: 'ERR', location: String(error) });
    }
  }

  const badPageFetches = checkedPages.filter((entry) => entry.status >= 400);
  const badLinks = results.filter((entry) => !(typeof entry.status === 'number' && (entry.status === 200 || (entry.status >= 300 && entry.status < 400))));

  const report = {
    origin: ORIGIN,
    pagesChecked: checkedPages.length,
    internalUrlsChecked: results.length,
    badPageFetches,
    badLinks,
    malformed,
  };

  console.log(JSON.stringify(report, null, 2));

  if (badPageFetches.length || badLinks.length || malformed.length) {
    process.exit(1);
  }
})();
