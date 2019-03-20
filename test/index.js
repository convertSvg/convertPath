const fs = require('fs')
const SVGParser = require('../lib/index.js')

const parse = SVGParser.parse('./test/test.svg', [
  {
    // convertShapeToPath: true,
    removeGroups: true,
  },
])

const result = parse.toSimpleSvg()
console.log(result)

const paths = parse.getPathAttributes()
console.log(paths)

fs.writeFileSync('./test/result.svg', result, 'utf-8')
