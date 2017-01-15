const fs = require('fs');
const parse = require('../lib/index.js');
const svgstr = fs.readFileSync('./test/test.svg').toString();


parse.parse("./test/test.svg")
console.log(parse.toSimpleSvg())

fs.writeFile("./test/result.svg", parse.toSimpleSvg(), "utf-8");