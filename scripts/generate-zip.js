import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function makeZip() {
  const zip = new JSZip();
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  function addDir(dir, zipFolder) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (
        entry.name === 'node_modules' ||
        entry.name === 'dist' ||
        entry.name === '.git' ||
        entry.name === 'public' ||
        entry.name === '.next' ||
        entry.name === '.cache'
      ) {
        continue;
      }
      if (entry.isDirectory()) {
        const subFolder = zipFolder.folder(entry.name);
        addDir(fullPath, subFolder);
      } else if (entry.isFile()) {
        if (!entry.name.endsWith('.zip') && !entry.name.startsWith('.env')) {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(entry.name, content);
        }
      }
    }
  }

  addDir(rootDir, zip);

  const zipPath = path.join(publicDir, 'tools-workshop.zip');
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
  fs.writeFileSync(zipPath, buffer);
  console.log(`ZIP created successfully at: ${zipPath} (${(buffer.length / 1024).toFixed(2)} KB)`);
}

makeZip().catch(console.error);
