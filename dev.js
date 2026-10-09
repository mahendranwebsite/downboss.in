const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting DownBoss.in services (Frontend + Python Backend)...');

// 1. Start Python Backend
const backend = spawn('python', ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Next.js Frontend
const frontend = spawn('npm', ['run', 'dev', '--prefix', 'frontend'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
