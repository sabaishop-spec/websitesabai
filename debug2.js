const fs = require('fs');
const content = fs.readFileSync('.next/server/chunks/261.js', 'utf8');
console.log(content.substring(0, 1000));
