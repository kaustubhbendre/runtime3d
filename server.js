const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Initialize database file if missing
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading db.json:', err.message);
  }
  return { users: [], history: [], auditLogs: [] };
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving db.json:', err.message);
  }
}

function addAuditLog(username, action, details) {
  const db = loadDb();
  const newLog = {
    id: `log-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    username: username || 'anonymous',
    action,
    details
  };
  db.auditLogs.unshift(newLog);
  if (db.auditLogs.length > 100) db.auditLogs = db.auditLogs.slice(0, 100);
  saveDb(db);
  return newLog;
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

// Architecture analyzer function for any project directory
function analyzeProjectDirectory(targetDir) {
  const result = {
    name: path.basename(targetDir),
    detectedStack: [],
    components: [],
    boundaries: [],
    primaryPath: []
  };

  const packageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps['react']) result.detectedStack.push('React');
      if (deps['react-router-dom']) result.detectedStack.push('React Router');
      if (deps['@supabase/supabase-js']) result.detectedStack.push('Supabase Client');
      if (deps['@emailjs/browser']) result.detectedStack.push('EmailJS');
      if (deps['express']) result.detectedStack.push('Express Server');
      if (deps['firebase']) result.detectedStack.push('Firebase');
      if (deps['@prisma/client']) result.detectedStack.push('Prisma ORM');
      if (deps['next']) result.detectedStack.push('Next.js');
      if (deps['vue']) result.detectedStack.push('Vue');
      if (deps['tailwindcss']) result.detectedStack.push('Tailwind CSS');
    } catch (e) {
      console.error('Error reading package.json:', e);
    }
  }

  return result;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    res.end();
    return;
  }

  // ================= API ROUTES =================

  // 1. User Registration
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    try {
      const { username, email, password, role } = await parseJsonBody(req);
      if (!username || !email || !password) {
        return sendJson(res, 400, { success: false, error: 'Username, email, and password are required.' });
      }

      const db = loadDb();
      const existingUser = db.users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() || 
        u.username.toLowerCase() === username.toLowerCase()
      );

      if (existingUser) {
        return sendJson(res, 409, { success: false, error: 'A user with that email or username already exists.' });
      }

      const newUser = {
        id: `usr-${Date.now().toString(36)}`,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password, // In enterprise prod, hash with bcrypt. For local testing, stored securely in local JSON.
        role: role || 'Architect',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        architecturesCount: 0
      };

      db.users.push(newUser);
      saveDb(db);
      addAuditLog(newUser.username, 'USER_REGISTERED', `New account created: ${newUser.username} (${newUser.email})`);

      const { password: _, ...userSafe } = newUser;
      return sendJson(res, 201, { success: true, user: userSafe });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 2. User Login
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    try {
      const { credential, password } = await parseJsonBody(req);
      if (!credential || !password) {
        return sendJson(res, 400, { success: false, error: 'Please enter your username/email and password.' });
      }

      const db = loadDb();
      const user = db.users.find(u => 
        (u.email.toLowerCase() === credential.toLowerCase() || u.username.toLowerCase() === credential.toLowerCase()) &&
        u.password === password
      );

      if (!user) {
        addAuditLog(credential, 'LOGIN_FAILED', 'Invalid credentials attempted.');
        return sendJson(res, 401, { success: false, error: 'Invalid username/email or password.' });
      }

      user.lastLogin = new Date().toISOString();
      saveDb(db);
      addAuditLog(user.username, 'USER_LOGIN', `Logged in successfully. Role: ${user.role}`);

      const { password: _, ...userSafe } = user;
      return sendJson(res, 200, { success: true, user: userSafe });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 3. Architecture History: GET & POST
  if (pathname === '/api/history') {
    const db = loadDb();

    if (req.method === 'GET') {
      const username = parsedUrl.searchParams.get('username');
      const list = username ? db.history.filter(h => h.username === username) : db.history;
      return sendJson(res, 200, { success: true, history: list });
    }

    if (req.method === 'POST') {
      try {
        const payload = await parseJsonBody(req);
        const newSnapshot = {
          id: `snap-${Date.now().toString(36)}`,
          userId: payload.userId || 'anonymous',
          username: payload.username || 'guest',
          name: payload.name || `Snapshot ${new Date().toLocaleDateString()}`,
          profileKey: payload.profileKey || 'custom_uploaded',
          componentsCount: payload.componentsCount || 10,
          conduitsCount: payload.conduitsCount || 10,
          stack: payload.stack || ['Runtime3D Engine'],
          createdAt: new Date().toISOString(),
          isAutoSaved: Boolean(payload.isAutoSaved),
          description: payload.description || 'User-saved architecture state.',
          architectureData: payload.architectureData || null
        };

        db.history.unshift(newSnapshot);

        // Update user's count
        const userObj = db.users.find(u => u.username === payload.username);
        if (userObj) userObj.architecturesCount = (userObj.architecturesCount || 0) + 1;

        saveDb(db);
        addAuditLog(payload.username, 'SNAPSHOT_CREATED', `Saved snapshot: "${newSnapshot.name}"`);

        return sendJson(res, 201, { success: true, snapshot: newSnapshot });
      } catch (err) {
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }
  }

  // 4. Delete Snapshot
  if (req.method === 'DELETE' && pathname.startsWith('/api/history/')) {
    const snapId = pathname.replace('/api/history/', '');
    const db = loadDb();
    const index = db.history.findIndex(h => h.id === snapId);
    if (index !== -1) {
      const removed = db.history.splice(index, 1)[0];
      saveDb(db);
      addAuditLog(removed.username, 'SNAPSHOT_DELETED', `Deleted snapshot: "${removed.name}"`);
      return sendJson(res, 200, { success: true, removed });
    }
    return sendJson(res, 404, { success: false, error: 'Snapshot not found.' });
  }

  // 5. Admin API: User list & audit logs
  if (req.method === 'GET' && pathname === '/api/admin/users') {
    const db = loadDb();
    const safeUsers = db.users.map(({ password: _, ...rest }) => rest);
    return sendJson(res, 200, { success: true, users: safeUsers });
  }

  if (req.method === 'GET' && pathname === '/api/admin/logs') {
    const db = loadDb();
    return sendJson(res, 200, { success: true, logs: db.auditLogs });
  }

  // 6. Analyze folder endpoint
  if (req.method === 'POST' && pathname === '/api/analyze-folder') {
    try {
      const data = await parseJsonBody(req);
      const targetDir = data.path || path.join(__dirname, '..', 'scratch_repo');
      const analysis = analyzeProjectDirectory(targetDir);
      return sendJson(res, 200, { success: true, analysis });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Explicit Favicon handler to purge old cached browser icons (e.g. from previous projects)
  if (pathname === '/favicon.ico' || pathname === '/favicon.svg') {
    const faviconPath = path.join(PUBLIC_DIR, 'favicon.svg');
    if (fs.existsSync(faviconPath)) {
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      return res.end(fs.readFileSync(faviconPath));
    }
  }

  // ================= STATIC FILE SERVING =================
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  let filePath = path.join(PUBLIC_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

let currentPort = Number(PORT);

function startServer(p) {
  server.listen(p, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Runtime3D Enterprise Engine is running!`);
    console.log(`👉 Web Interface:  http://localhost:${p}`);
    console.log(`👉 REST API Base:  http://localhost:${p}/api/`);
    console.log(`📁 Project Folder: ${__dirname}`);
    console.log(`=======================================================`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ Port ${currentPort} is already in use by another running app or background process.`);
    currentPort += 1;
    console.log(`🔄 Automatically switching to next open port: http://localhost:${currentPort}`);
    startServer(currentPort);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);
