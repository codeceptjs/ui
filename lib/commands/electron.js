import { join } from 'path';
import { spawn } from 'child_process';
import { setHeadedWhen } from '@codeceptjs/configure';
import { createRequire } from 'module';

const cjsRequire = createRequire(import.meta.url);

setHeadedWhen(true);

function resolve(mod, resolver) {
  try {
    return (resolver || cjsRequire)(mod);
  } catch (_) {
    // ignore
  }
}

let electronPath;
try {
  const whichSync = cjsRequire('which').sync;
  electronPath = process.env.ELECTRON_PATH || resolve('electron') || resolve('electron-prebuilt') || resolve('electron', whichSync);
} catch (_) {
  electronPath = process.env.ELECTRON_PATH || resolve('electron') || resolve('electron-prebuilt');
}

if (!electronPath) {
  console.error('');
  console.error('  Can not find `electron` in $PATH and $ELECTRON_PATH is not set.');
  console.error('  Please either set $ELECTRON_PATH or `npm install electron`.');
  console.error('');
  process.exit(1);
}

run(electronPath);

function run(electron) {
  let args = [
    join(import.meta.dirname, '../app.js'),
    ...process.argv.slice(2)
  ];

  let child = spawn(electron, args);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  process.stdin.pipe(child.stdin);

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code);
    }
  });

  process.on('SIGINT', () => {
    child.kill('SIGINT');
    child.kill('SIGTERM');
  });
}