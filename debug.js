const fs = require('fs');
const content = fs.readFileSync('.next/server/chunks/611.js', 'utf8');
const lines = content.split('\n');
console.log(lines[5].substring(1250, 1450));
