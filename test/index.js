const fs = require('fs')
const SVGParser = require('../lib/index.js')

const parse = SVGParser.parse('./test/test.svg', {
  plugins: [
    {
      convertUseToGroup: true, // at first
    },
    {
      convertShapeToPath: true,
    },
    {
      removeGroups: true,
    },
    {
      convertTransfromforPath: true,
    },
    {
      viewBoxTransform: true, // at last
    },
  ],
  size: 1000,
})

const result = parse.toSimpleSvg()
console.log(result)

const paths = parse.getPathAttributes()
console.log(paths)

fs.writeFileSync('./test/result.svg', result, 'utf-8')
