#!/usr/bin/env node

/**
 * 3D Runtime Architecture Visualizer CLI
 * Usage:
 *   npx 3d-runtime-arch [path/to/project]
 *   node cli.js [path/to/project]
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const targetPath = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log(`\n======================================================`);
console.log(`🔍 Analyzing Architecture for: ${targetPath}`);
console.log(`======================================================\n`);

if (!fs.existsSync(targetPath)) {
  console.error(`❌ Error: Directory not found at ${targetPath}`);
  process.exit(1);
}

const packageJsonPath = path.join(targetPath, 'package.json');
let detectedStack = [];

if (fs.existsSync(packageJsonPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`📦 Project Name: ${pkg.name || 'Unnamed'}`);
    console.log(`📌 Version: ${pkg.version || '1.0.0'}`);

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    console.log(`\n🔎 Scanning dependencies & cloud integrations...`);

    if (deps['react']) detectedStack.push('Frontend: React');
    if (deps['react-router-dom']) detectedStack.push('Routing: React Router v6');
    if (deps['@supabase/supabase-js']) detectedStack.push('Database & Auth: Supabase Client');
    if (deps['@emailjs/browser']) detectedStack.push('Notification: EmailJS');
    if (deps['express']) detectedStack.push('Backend Server: Express.js');
    if (deps['nodemailer']) detectedStack.push('Mail Service: Nodemailer');
    if (deps['framer-motion']) detectedStack.push('Motion & 3D: Framer Motion');

    detectedStack.forEach(s => console.log(`   ✓ ${s}`));
  } catch (e) {
    console.warn(`⚠️ Could not parse package.json:`, e.message);
  }
} else {
  console.log(`ℹ️ No package.json found. Scanning directory tree directly...`);
}

console.log(`\n🚀 Launching 3D Runtime Architecture Visualizer on http://localhost:3000 ...`);

const serverPath = path.join(__dirname, 'server.js');
const server = spawn('node', [serverPath], { stdio: 'inherit' });

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});
