const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const contentPath = path.join(dataDir, 'content.json');
const volunteerPath = path.join(dataDir, 'volunteer-submissions.json');
const donationLogPath = path.join(dataDir, 'donation-log.json');
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const adminSecret = process.env.ADMIN_SECRET || 'change-me-in-env';
const tokenTtlSeconds = 8 * 60 * 60;

app.use(express.json({ limit: '25mb' }));

app.use('/media', express.static(path.join(rootDir, 'public', 'media')));
app.use('/media', express.static(path.join(rootDir, 'dist', 'media')));

function ensureContentFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(contentPath)) {
    fs.writeFileSync(
      contentPath,
      JSON.stringify({ programs: [], stories: [], galleryData: [] }, null, 2),
      'utf8'
    );
  }
}

function readContent() {
  ensureContentFile();
  const raw = fs.readFileSync(contentPath, 'utf8');
  return JSON.parse(raw);
}

function writeContent(next) {
  ensureContentFile();
  fs.writeFileSync(contentPath, JSON.stringify(next, null, 2), 'utf8');
}

function ensureArrayFile(filePath) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
  }
}

function readArrayFile(filePath) {
  ensureArrayFile(filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function writeArrayFile(filePath, next) {
  ensureArrayFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(next, null, 2), 'utf8');
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function signPayload(payload) {
  return crypto.createHmac('sha256', adminSecret).update(payload).digest('base64url');
}

function createToken(username) {
  const payload = JSON.stringify({
    username,
    exp: Math.floor(Date.now() / 1000) + tokenTtlSeconds
  });
  const encodedPayload = base64url(payload);
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [encodedPayload, signature] = token.split('.');
  const expected = signPayload(encodedPayload);
  if (signature !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_error) {
    return null;
  }
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  req.admin = payload;
  return next();
}

function sanitizeFilename(name) {
  const cleaned = String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || `upload-${Date.now()}.bin`;
}

app.get('/api/content', (_req, res) => {
  try {
    const content = readContent();
    res.json(content);
  } catch (_error) {
    res.status(500).json({ error: 'Could not read website content.' });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }
  const token = createToken(String(username));
  return res.json({ token, expiresIn: tokenTtlSeconds });
});

app.get('/api/admin/content', requireAdmin, (_req, res) => {
  try {
    const content = readContent();
    return res.json(content);
  } catch (_error) {
    return res.status(500).json({ error: 'Could not read admin content.' });
  }
});

app.put('/api/admin/content/:section', requireAdmin, (req, res) => {
  const { section } = req.params;
  const allowed = ['programs', 'stories', 'galleryData'];
  if (!allowed.includes(section)) {
    return res.status(400).json({ error: 'Unsupported content section.' });
  }

  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Request body must be an array.' });
  }

  try {
    const content = readContent();
    content[section] = req.body;
    writeContent(content);
    return res.json({ success: true, content });
  } catch (_error) {
    return res.status(500).json({ error: 'Could not update content.' });
  }
});

app.post('/api/admin/upload-media', requireAdmin, (req, res) => {
  const { filename, dataBase64 } = req.body || {};
  if (!filename || !dataBase64) {
    return res.status(400).json({ error: 'filename and dataBase64 are required.' });
  }

  const safeName = sanitizeFilename(filename);
  const mediaDir = path.join(rootDir, 'public', 'media');
  const outputPath = path.join(mediaDir, safeName);

  try {
    fs.mkdirSync(mediaDir, { recursive: true });
    const buffer = Buffer.from(String(dataBase64), 'base64');
    fs.writeFileSync(outputPath, buffer);
    return res.json({ success: true, src: `/media/${safeName}` });
  } catch (_error) {
    return res.status(500).json({ error: 'Could not store uploaded media file.' });
  }
});

app.get('/api/admin/volunteer-submissions', requireAdmin, (_req, res) => {
  try {
    const items = readArrayFile(volunteerPath);
    return res.json({ items });
  } catch (_error) {
    return res.status(500).json({ error: 'Could not load volunteer submissions.' });
  }
});

app.get('/api/admin/donation-log', requireAdmin, (_req, res) => {
  try {
    const items = readArrayFile(donationLogPath);
    return res.json({ items });
  } catch (_error) {
    return res.status(500).json({ error: 'Could not load donation log.' });
  }
});

app.post('/api/admin/donation-log', requireAdmin, (req, res) => {
  const { donorName, amount, method, reference } = req.body || {};
  if (!donorName || !amount || !method) {
    return res.status(400).json({ error: 'donorName, amount and method are required.' });
  }
  try {
    const items = readArrayFile(donationLogPath);
    items.unshift({
      donorName: String(donorName).trim(),
      amount: Number(amount),
      method: String(method).trim(),
      reference: String(reference || '').trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    });
    writeArrayFile(donationLogPath, items);
    return res.json({ success: true, items });
  } catch (_error) {
    return res.status(500).json({ error: 'Could not save donation entry.' });
  }
});

app.get('/api/foundation', (_req, res) => {
  res.json({
    name: 'Samrawit Foundation',
    established: 'August 16, 2023',
    mission:
      'Supporting destitute children, elderly individuals, and people living with disabilities by restoring dignity, hope, and opportunity.',
    focusAreas: ['Health care support', 'Educational assistance', 'Basic living needs'],
    coverage: 'Bole and Gulele sub-cities in Addis Ababa across three woredas',
    currentBeneficiaries: '60+',
    contact: {
      email: 'samrawitfoundation@gmail.com',
      telegram: 'https://t.me/samrawitfoundation'
    }
  });
});

app.post('/api/get-involved', async (req, res) => {
  const { fullName, phoneNumber, email, helpType, receiveUpdates } = req.body || {};
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const telegramThreadId = process.env.TELEGRAM_THREAD_ID;

  if (!fullName || !phoneNumber || !helpType || !email) {
    return res.status(400).json({ error: 'fullName, phoneNumber, email, and helpType are required.' });
  }

  if (!telegramBotToken || !telegramChatId) {
    return res.status(500).json({
      error: 'Telegram bot is not configured on the server.',
      missing: {
        TELEGRAM_BOT_TOKEN: !telegramBotToken,
        TELEGRAM_CHAT_ID: !telegramChatId
      }
    });
  }

  const message = [
    'New Get Involved Form Submission',
    `Full Name: ${String(fullName).trim()}`,
    `Phone Number: ${String(phoneNumber).trim()}`,
    `Email: ${String(email).trim()}`,
    `How They Want to Help: ${String(helpType).trim()}`,
    `Wants Updates: ${receiveUpdates ? 'Yes' : 'No'}`
  ].join('\n');

  const payload = {
    chat_id: telegramChatId,
    text: message
  };

  if (telegramThreadId) {
    payload.message_thread_id = Number(telegramThreadId);
  }

  try {
    try {
      const submissions = readArrayFile(volunteerPath);
      submissions.unshift({
        fullName: String(fullName).trim(),
        phoneNumber: String(phoneNumber).trim(),
        email: String(email).trim(),
        helpType: String(helpType).trim(),
        receiveUpdates: Boolean(receiveUpdates),
        submittedAt: new Date().toISOString().slice(0, 10)
      });
      writeArrayFile(volunteerPath, submissions);
    } catch (_writeError) {
      // Keep request flow alive even if local logging fails.
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!telegramResponse.ok) {
      let details = '';
      let telegramDescription = '';
      try {
        const errorBody = await telegramResponse.json();
        details = JSON.stringify(errorBody);
        telegramDescription = errorBody?.description || '';
      } catch (_parseError) {
        details = await telegramResponse.text();
      }
      return res.status(502).json({
        error: telegramDescription ? `Failed to send message to Telegram: ${telegramDescription}` : 'Failed to send message to Telegram.',
        details
      });
    }

    return res.json({ success: true });
  } catch (_error) {
    return res.status(500).json({ error: 'Unexpected server error while sending Telegram message.' });
  }
});

const distPath = path.join(rootDir, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Samrawit Foundation app running on http://localhost:${port}`);
});

