const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const waitOn = require('wait-on');

let mainWindow;
let phpServer;

const LARAVEL_URL = 'http://127.0.0.1:8000';
const PHP_PORT = 8000;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'public', 'favicon.ico'),
  });

  mainWindow.loadURL(LARAVEL_URL);

  // Open DevTools in development (optional)
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startLaravelServer() {
  return new Promise((resolve, reject) => {
    console.log('Starting Laravel development server...');

    const isWindows = process.platform === 'win32';
    const phpCommand = isWindows ? 'php' : 'php';

    phpServer = spawn(phpCommand, ['artisan', 'serve', '--host=127.0.0.1', `--port=${PHP_PORT}`], {
      cwd: __dirname,
      shell: isWindows,
      stdio: 'pipe',
    });

    phpServer.stdout.on('data', (data) => {
      console.log(`[Laravel] ${data.toString()}`);
    });

    phpServer.stderr.on('data', (data) => {
      console.error(`[Laravel Error] ${data.toString()}`);
    });

    phpServer.on('error', (error) => {
      console.error('Failed to start Laravel server:', error);
      reject(error);
    });

    // Wait for Laravel server to be ready
    waitOn({
      resources: [LARAVEL_URL],
      timeout: 30000,
      interval: 500,
    })
      .then(() => {
        console.log('Laravel server is ready!');
        resolve();
      })
      .catch((err) => {
        console.error('Laravel server failed to start:', err);
        reject(err);
      });
  });
}

function stopLaravelServer() {
  if (phpServer) {
    console.log('Stopping Laravel server...');
    
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Windows: Kill the process tree
      spawn('taskkill', ['/pid', phpServer.pid, '/f', '/t']);
    } else {
      // Unix: Send SIGTERM
      phpServer.kill('SIGTERM');
    }
    
    phpServer = null;
  }
}

app.whenReady().then(async () => {
  try {
    await startLaravelServer();
    createWindow();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopLaravelServer();
  app.quit();
});

app.on('before-quit', () => {
  stopLaravelServer();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  stopLaravelServer();
  app.quit();
});

