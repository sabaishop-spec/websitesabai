const fs = require('fs');
const content = fs.readFileSync('.next/server/chunks/261.js', 'utf8');
const index = content.indexOf('Html');
console.log(content.substring(Math.max(0, index - 200), index + 200));
