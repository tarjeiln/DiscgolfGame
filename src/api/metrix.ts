import type { IncomingMessage, ServerResponse } from 'http';

const TARGET = 'https://discgolfmetrix.com/api.php';

export default async function handler(req: IncomingMessage & { query: Record<string, any> }, res: ServerResponse) {
  try {
    const url = new URL(TARGET);
    for (const [k, v] of Object.entries(req.query ?? {})) {
      if (Array.isArray(v)) v.forEach(val => url.searchParams.append(k, String(val)));
      else url.searchParams.set(k, String(v));
    }

    const r = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'User-Agent': 'DiscgolfGame/1.0' }
    });

    const text = await r.text();
    res.statusCode = r.status;
    res.setHeader('Content-Type', r.headers.get('content-type') ?? 'text/plain');
    res.end(text);
  } catch (e: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'metrix_proxy_failed', message: e?.message ?? 'unknown' }));
  }
}
