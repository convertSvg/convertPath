const fs = require('fs')
const SVGParser = require('../lib/index.js')

const parse = SVGParser.parse('./test/test.svg', {
  plugins: [
    {
      convertShapeToPath: true,
    },
    {
      removeGroups: true,
    },
    {
      viewBoxTransform: true, // 必须放到最后
    },
  ],
  size: 1000,
})

const result = parse.toSimpleSvg()
console.log(result)

const paths = parse.getPathAttributes()
console.log(paths)

fs.writeFileSync('./test/result.svg', result, 'utf-8')
