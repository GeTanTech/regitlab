const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const outputDir = path.join(__dirname, 'regitlab');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  ensureDir(destDir);
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  ensureDir(dest);
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
}

async function minifyJS(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const result = await minify(code, {
    compress: {
      drop_console: false,
      passes: 1
    },
    mangle: {
      toplevel: false,
      properties: false
    },
    format: {
      comments: false
    }
  });
  return result.code;
}

async function build() {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  ensureDir(outputDir);

  const jsFiles = ['background.js', 'popup.js', 'replacement/rules.js', 'content.js', 'config-bridge.js', 'config-injector.js'];
  
  for (const file of jsFiles) {
    const srcPath = path.join(__dirname, file);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(outputDir, file);
      ensureDir(path.dirname(destPath));
      const minified = await minifyJS(srcPath);
      fs.writeFileSync(destPath, minified);
    }
  }

  copyFile('manifest.json', path.join(outputDir, 'manifest.json'));
  copyFile('popup.html', path.join(outputDir, 'popup.html'));
  copyDir('icons', path.join(outputDir, 'icons'));
  copyDir('replacement/js', path.join(outputDir, 'replacement/js'));
  copyDir('replacement/css', path.join(outputDir, 'replacement/css'));
  copyDir('replacement/json', path.join(outputDir, 'replacement/json'));

  console.log('构建完成，输出目录: regitlab/');
}
build().catch(console.error);
