import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const replaceTemplateVariables = (template, data) => {
  if (!template) return '';
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value || '');
  }
  return result;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const payloadData = { name, email, phone: phone || 'Không có', message };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.VITE_SMTP_USER,
      pass: process.env.VITE_SMTP_PASS
    }
  });

  try {
    // Lấy cấu hình Email từ Database
    const { data: adminTmpl } = await supabase.from('system_settings').select('value').eq('key', 'email_template_admin_contact').single();
    const { data: customerTmpl } = await supabase.from('system_settings').select('value').eq('key', 'email_template_customer_reply').single();

    // 1. Gửi cho Admin
    if (adminTmpl && adminTmpl.value) {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.VITE_SMTP_USER}>`,
        to: process.env.VITE_SMTP_USER,
        subject: replaceTemplateVariables(adminTmpl.value.subject, payloadData),
        html: replaceTemplateVariables(adminTmpl.value.htmlBody, payloadData)
      });
    }

    // 2. Gửi cho Khách
    if (customerTmpl && customerTmpl.value) {
      await transporter.sendMail({
        from: `"Nguyễn Trọng Hữu" <${process.env.VITE_SMTP_USER}>`,
        to: email,
        subject: replaceTemplateVariables(customerTmpl.value.subject, payloadData),
        html: replaceTemplateVariables(customerTmpl.value.htmlBody, payloadData)
      });
    }

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    return res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}
