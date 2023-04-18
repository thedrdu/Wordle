const fs = require('fs');

const fileContent = fs.readFileSync('./data/words.txt', 'utf-8');
const words = fileContent.split('\n');
const jsArray = `const words = ${JSON.stringify(words)};`;

//write the JavaScript string to a file
fs.writeFileSync('words.js', jsArray, 'utf-8');
