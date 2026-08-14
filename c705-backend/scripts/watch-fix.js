const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function fixDist() {
  const distPath = path.join(__dirname, '..', 'dist');
  const wrongPath = path.join(distPath, 'c705-backend', 'src');
  const mainPath = path.join(distPath, 'main.js');

  if (fs.existsSync(wrongPath) && !fs.existsSync(mainPath)) {
    try {
      console.log('🔧 Fixing dist structure...');
      const tempPath = path.join(distPath, '..', 'dist-temp');
      
      // Copy files
      if (fs.existsSync(tempPath)) {
        fs.rmSync(tempPath, { recursive: true, force: true });
      }
      fs.mkdirSync(tempPath, { recursive: true });
      
      // Copy all files from wrong location
      const files = fs.readdirSync(wrongPath);
      for (const file of files) {
        const src = path.join(wrongPath, file);
        const dest = path.join(tempPath, file);
        if (fs.statSync(src).isDirectory()) {
          fs.cpSync(src, dest, { recursive: true });
        } else {
          fs.copyFileSync(src, dest);
        }
      }
      
      // Clean dist and move files (preserve c705_db)
      const distFiles = fs.readdirSync(distPath);
      for (const file of distFiles) {
        const filePath = path.join(distPath, file);
        if (file !== 'c705_db' && file !== 'c705-backend') {
          fs.rmSync(filePath, { recursive: true, force: true });
        }
      }
      
      // Remove c705-backend folder
      const wrongFolder = path.join(distPath, 'c705-backend');
      if (fs.existsSync(wrongFolder)) {
        fs.rmSync(wrongFolder, { recursive: true, force: true });
      }
      
      const tempFiles = fs.readdirSync(tempPath);
      for (const file of tempFiles) {
        const src = path.join(tempPath, file);
        const dest = path.join(distPath, file);
        fs.renameSync(src, dest);
      }
      
      fs.rmSync(tempPath, { recursive: true, force: true });
      console.log('✅ Dist structure fixed!');
      return true;
    } catch (error) {
      console.error('❌ Error fixing dist:', error.message);
      return false;
    }
  }
  return false;
}

// Fix immediately and wait a bit
console.log('🔧 Initial dist fix...');
fixDist();

// Watch for changes in dist folder
const distPath = path.join(__dirname, '..', 'dist');
const watcher = chokidar.watch(distPath, {
  ignored: /node_modules/,
  persistent: true,
  ignoreInitial: false,
  depth: 2
});

let fixTimeout;
watcher.on('change', (filePath) => {
  if (filePath.includes('c705-backend/src') || filePath.includes('main.js')) {
    clearTimeout(fixTimeout);
    fixTimeout = setTimeout(() => {
      fixDist();
    }, 300);
  }
});

watcher.on('add', (filePath) => {
  if (filePath.includes('c705-backend/src/main.js')) {
    clearTimeout(fixTimeout);
    fixTimeout = setTimeout(() => {
      fixDist();
    }, 300);
  }
});

watcher.on('addDir', (dirPath) => {
  if (dirPath.includes('c705-backend/src')) {
    clearTimeout(fixTimeout);
    fixTimeout = setTimeout(() => {
      fixDist();
    }, 300);
  }
});

console.log('👀 Watching dist folder for changes...');

