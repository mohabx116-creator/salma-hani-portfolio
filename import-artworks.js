import fs from 'fs';
import path from 'path';

const worksDir = path.resolve('..', 'artworks');
const destDir = path.resolve('src', 'assets', 'artworks');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const folders = fs.readdirSync(worksDir).filter(f => fs.statSync(path.join(worksDir, f)).isDirectory());

const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const artworks = [];

for (const folder of folders) {
  const folderPath = path.join(worksDir, folder);
  const files = fs.readdirSync(folderPath);
  
  let imageFile = files.find(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
  let txtFile = files.find(f => f.endsWith('.txt'));
  
  if (imageFile) {
    const ext = path.extname(imageFile);
    const newImageName = `${slugify(folder)}${ext}`;
    fs.copyFileSync(path.join(folderPath, imageFile), path.join(destDir, newImageName));
    
    let description = '';
    let category = 'portraits';
    if (txtFile) {
      const txtContent = fs.readFileSync(path.join(folderPath, txtFile), 'utf8');
      description = txtContent;
    }
    
    artworks.push({
      folderName: folder,
      imageFile: newImageName,
      txtFile: txtFile,
      content: description
    });
  }
}

fs.writeFileSync('artworks-data.json', JSON.stringify(artworks, null, 2));
console.log('Done!');
