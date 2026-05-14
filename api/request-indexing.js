import { google } from 'googleapis';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Missing URL parameter' });
    }

    // Load credentials from environment variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    // Handle Vercel env var newline escaping
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      return res.status(500).json({ 
        error: 'Chưa cấu hình tài khoản Google Service Account. Vui lòng thêm GOOGLE_CLIENT_EMAIL và GOOGLE_PRIVATE_KEY vào Vercel.' 
      });
    }

    // Authenticate using JWT
    const jwtClient = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );

    await jwtClient.authorize();

    // Call the Indexing API
    const response = await google.indexing('v3').urlNotifications.publish({
      auth: jwtClient,
      requestBody: {
        url: url,
        type: 'URL_UPDATED'
      }
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Đã gửi yêu cầu Index lên Google thành công', 
      data: response.data 
    });

  } catch (error) {
    console.error('Error requesting indexing:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Lỗi khi gửi yêu cầu Index' 
    });
  }
}
