const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const mainPath = path.join(distPath, 'main.js');
const wrongMainPath = path.join(distPath, 'c705-backend', 'src', 'main.js');

function ensureMain() {
  // If main.js doesn't exist but wrong path does, create symlink or copy
  if (!fs.existsSync(mainPath) && fs.existsSync(wrongMainPath)) {
    try {
      // Try to create symlink (works on Unix/Mac)
      fs.symlinkSync(path.relative(distPath, wrongMainPath), mainPath, 'file');
      console.log('✅ Created symlink: dist/main.js -> dist/c705-backend/src/main.js');
    } catch (error) {
      // If symlink fails (Windows or permission issue), copy the file
      try {
        fs.copyFileSync(wrongMainPath, mainPath);
        console.log('✅ Copied main.js to correct location');
      } catch (copyError) {
        console.error('❌ Failed to create main.js:', copyError.message);
      }
    }
  }
}

// Run immediately
ensureMain();

// Watch for changes
const chokidar = require('chokidar');
const watcher = chokidar.watch(distPath, {
  ignored: /node_modules/,
  persistent: true,
  depth: 3
});

watcher.on('add', (filePath) => {
  if (filePath.includes('c705-backend/src/main.js')) {
    setTimeout(ensureMain, 100);
  }
});

watcher.on('change', (filePath) => {
  if (filePath.includes('main.js')) {
    setTimeout(ensureMain, 100);
  }
});

console.log('👀 Ensuring dist/main.js exists...');

