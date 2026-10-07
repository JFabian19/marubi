const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outputDirs = ['dist', 'build', 'public'];

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const filesToCopy = [
  'index.html',
  'styles.css',
  'app.js',
  'README.md',
  'screen_details.json'
];

outputDirs.forEach((dirName) => {
  const targetDir = path.join(rootDir, dirName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const file of filesToCopy) {
    const src = path.join(rootDir, file);
    const dest = path.join(targetDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  copyDirSync(path.join(rootDir, 'assets'), path.join(targetDir, 'assets'));
});

console.log('Build completed successfully: Static files copied to dist, build, and public.');
