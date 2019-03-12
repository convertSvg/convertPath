const fs = require('fs')
const parse = require('../lib/index.js')

parse.parse('./test/test.svg')
const result = parse.toSimpleSvg()
console.log(result)

fs.writeFile('./test/result.svg', result, 'utf-8')
