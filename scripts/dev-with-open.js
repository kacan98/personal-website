#!/usr/bin/env node

const { spawn } = require('child_process');
const { platform } = require('os');

// Start Next.js
const nextProcess = spawn('next', ['dev'], {
  stdio: ['inherit', 'pipe', 'inherit'],
  shell: true
});

let hasOpened = false;

nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // Look for the "Local:" line to get the actual URL
  const localMatch = output.match(/- Local:\s+(http:\/\/localhost:\d+)/);
  
  if (localMatch && !hasOpened) {
    const url = localMatch[1];
    hasOpened = true;
    
    // Open the browser with the correct URL
    setTimeout(() => {
      const openCommand = platform() === 'darwin' ? 'open' :
                         platform() === 'win32' ? 'start' :
                         'xdg-open';
      
      spawn(openCommand, [url], { 
        detached: true,
        stdio: 'ignore',
        shell: true
      });
    }, 500); // Small delay to ensure Next.js is fully ready
  }
});

// Handle process termination
process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
  process.exit();
});