const fs = require('fs')
const parse = require('../lib/index.js')
const svgstr = fs.readFileSync('./test/test.svg').toString()

console.log('Before parsing: ', svgstr)

parse.parse('./test/test.svg')
fs.writeFileSync('./test/result.svg', parse.toSimpleSvg(), 'utf-8')

console.log('Parsing result: ', parse.toSimpleSvg())
