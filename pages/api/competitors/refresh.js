import connectToDB from '../../../utils/db';
import CompetitorEvent from '../../../models/CompetitorEvent';
import Alert from '../../../models/Alert';

// Minimal RSS parser for common fields without extra deps
function parseRss(xml) {
  const items = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gim;
  const entryRegex = /<entry[\s\S]*?<\/entry>/gim; // Atom support
  const matchItems = xml.match(itemRegex) || xml.match(entryRegex) || [];
  for (const chunk of matchItems) {
    const title = (chunk.match(/<title>([\s\S]*?)<\/title>/i) || [null, ''])[1]
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .trim();
    const link = (chunk.match(/<link>([\s\S]*?)<\/link>/i) || [null, ''])[1]
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .trim() || (chunk.match(/<link[^>]*href=["']([^"']+)["']/i) || [null, ''])[1] || '';
    const pubDate = (chunk.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [null, ''])[1]
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .trim() || (chunk.match(/<updated>([\s\S]*?)<\/updated>/i) || [null, ''])[1] || '';
    const description = (chunk.match(/<description>([\s\S]*?)<\/description>/i) || [null, ''])[1]
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .trim() || (chunk.match(/<summary>([\s\S]*?)<\/summary>/i) || [null, ''])[1] || '';
    if (!title && !link) continue;
    items.push({ title, link, pubDate, description });
  }
  return items;
}

function simpleHash(input) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

const FEEDS = [
  { source: 'TechCrunch Startups', url: 'https://techcrunch.com/category/startups/feed/' },
  { source: 'Hacker News', url: 'https://hnrss.org/frontpage' },
  { source: 'Crunchbase News', url: 'https://news.crunchbase.com/feed/' },
  { source: 'AngelList Blog', url: 'https://www.angellist.com/blog/rss' }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await connectToDB();
  let created = 0;
  let checked = 0;
  const errors = [];

  for (const feed of FEEDS) {
    try {
      const response = await fetch(feed.url, { headers: { 'User-Agent': 'ai-cofounder-bot' } });
      const xml = await response.text();
      const items = parseRss(xml).slice(0, 15);
      for (const it of items) {
        checked += 1;
        const title = it.title || 'Untitled';
        const url = it.link || '';
        const publishedAt = it.pubDate ? new Date(it.pubDate) : new Date();
        const summary = it.description ? it.description.replace(/<[^>]+>/g, '').slice(0, 500) : '';
        const key = `${feed.source}|${title}|${url}|${publishedAt.toISOString()}`;
        const hash = simpleHash(key);
        const existing = await CompetitorEvent.findOne({ hash });
        if (existing) continue;
        await CompetitorEvent.create({
          source: feed.source,
          competitorName: feed.source,
          title,
          url,
          summary,
          publishedAt,
          hash
        });
        created += 1;
      }
    } catch (e) {
      errors.push({ source: feed.source, error: e?.message || 'fetch_failed' });
    }
  }

  if (created > 0) {
    await Alert.create({
      type: 'competitor',
      title: 'New market updates',
      message: `${created} new market events detected`,
      link: '/dashboard'
    });
  }

  return res.status(200).json({ created, checked, errors });
}


