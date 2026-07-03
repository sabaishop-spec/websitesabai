import fs from 'fs';

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/"Trắng răng "Trắng Răng & Khử Mùi" khử mùi"/g, '"Trắng răng & khử mùi"');
fs.writeFileSync('src/components/Footer.tsx', footer);

let products = fs.readFileSync('src/data/products.ts', 'utf8');
products = products.replace(/title: 'Trắng răng title: 'Trắng răng & khử mùi' khử mùi'/g, "title: 'Trắng răng & khử mùi'");
fs.writeFileSync('src/data/products.ts', products);

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');
i18n = i18n.replace(/"Trắng răng "Trắng răng & khử mùi" khử mùi"/g, '"Trắng răng & khử mùi"');
fs.writeFileSync('src/i18n.ts', i18n);

console.log('Fixed strings!');
