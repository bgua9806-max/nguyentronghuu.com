const SITE_HOST = 'nguyentronghuu.com';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const INDEXNOW_KEY = '5d47157d98844a2682c8abc291437ddd';
const KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const requested = Array.isArray(req.body?.urls) ? req.body.urls : [req.body?.url];
  const urls = [...new Set(requested.filter(Boolean))].slice(0, 100);

  if (!urls.length) return res.status(400).json({ error: 'Missing URL' });

  const validUrls = urls.every((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'https:' && parsed.hostname === SITE_HOST && !parsed.hash;
    } catch {
      return false;
    }
  });

  if (!validUrls) return res.status(400).json({ error: `Only canonical URLs on ${SITE_HOST} are allowed` });

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
      }),
    });

    if (!response.ok && response.status !== 202) {
      const detail = await response.text();
      return res.status(502).json({ error: 'IndexNow rejected the request', status: response.status, detail });
    }

    return res.status(200).json({ success: true, submitted: urls.length, upstreamStatus: response.status });
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Unable to reach IndexNow' });
  }
}
