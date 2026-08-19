import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Cấu hình Server-Sent Events (SSE) chuẩn giao thức MCP
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const sessionId = crypto.randomUUID();
  const host = req.headers.host || 'nguyentronghuu.com';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const postEndpoint = `${protocol}://${host}/api/mcp?sessionId=${sessionId}`;

  // Gửi sự kiện 'endpoint' cho ChatGPT / MCP Client theo chuẩn MCP Specification
  res.write(`event: endpoint\ndata: ${postEndpoint}\n\n`);

  // Giữ kết nối SSE mở
  const keepAliveInterval = setInterval(() => {
    try {
      res.write(': keep-alive\n\n');
    } catch {
      clearInterval(keepAliveInterval);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(keepAliveInterval);
    res.end();
  });
}
