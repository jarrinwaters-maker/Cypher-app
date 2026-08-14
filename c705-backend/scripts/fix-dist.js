const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const wrongPath = path.join(distPath, 'c705-backend', 'src');
const mainPath = path.join(distPath, 'main.js');

// Check if main.js already exists in the right place
if (fs.existsSync(mainPath)) {
  console.log('✓ main.js already exists in dist/');
  process.exit(0);
}

// Fix nested structure - move files from dist/c705-backend/src to dist/
if (fs.existsSync(wrongPath)) {
  try {
    console.log('Moving files from nested structure...');
    const files = fs.readdirSync(wrongPath);
    for (const file of files) {
      const src = path.join(wrongPath, file);
      const dest = path.join(distPath, file);
      try {
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
        }
        fs.renameSync(src, dest);
      } catch (err) {
        console.error(`Error moving ${file}:`, err.message);
      }
    }
    
    // Remove nested directory
    try {
      fs.rmSync(path.join(distPath, 'c705-backend'), { recursive: true, force: true });
      console.log('✓ Removed nested directory structure');
    } catch (err) {
      console.error('Error removing nested directory:', err.message);
    }
  } catch (err) {
    console.error('Error fixing dist structure:', err.message);
    process.exit(1);
  }
}

// Create symlinks if main.js is still in nested location
const nestedMain = path.join(distPath, 'c705-backend', 'src', 'main.js');
if (fs.existsSync(nestedMain) && !fs.existsSync(mainPath)) {
  try {
    const mainSrc = path.join('c705-backend', 'src', 'main.js');
    const mapSrc = path.join('c705-backend', 'src', 'main.js.map');
    
    fs.symlinkSync(mainSrc, mainPath, 'file');
    console.log('✓ Created symlink for main.js');
    
    const mapPath = path.join(distPath, 'main.js.map');
    if (fs.existsSync(path.join(distPath, 'c705-backend', 'src', 'main.js.map')) && !fs.existsSync(mapPath)) {
      fs.symlinkSync(mapSrc, mapPath, 'file');
      console.log('✓ Created symlink for main.js.map');
    }
  } catch (err) {
    console.error('Error creating symlinks:', err.message);
  }
}

// Final check
if (fs.existsSync(mainPath)) {
  console.log('✓ Dist structure fixed - main.js is ready');
} else {
  // Check if nest build created it directly in dist/
  const directMain = path.join(distPath, 'main.js');
  if (fs.existsSync(directMain)) {
    console.log('✓ main.js exists directly in dist/');
  } else {
    console.log('⚠ main.js not found - nest build may create it directly');
    console.log('  This is OK if nest build outputs directly to dist/');
  }
}

