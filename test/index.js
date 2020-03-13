const fs = require('fs')
const SVGParser = require('../lib/index.js')

const parse = SVGParser.parse('./test/xxgroup.svg', {
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
      removeGradient: true,
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

fs.writeFileSync('./test/xxgroup111.svg', result, 'utf-8')
