const dir = process.cwd()
const path = require('path')
const SVGParser = require(path.join(dir, 'lib/index'))
const removeGroups = require(path.join(
  dir,
  'lib/filter/removeGroups'
)).fn

describe('move some group and move some group attributes to the contained elements', () => {
  test('removeGroups', () => {
    const parse = SVGParser.parseStr(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="scale(2)"><path transform="rotate(45)" d="M0,0 L10,20"/><path transform="translate(10, 20)" d="M0,10 L20,30"/></g></svg>',
      {}
    )
    removeGroups(parse.Doc)
    console.error(parse.toSimpleSvg())
    expect(parse.toSimpleSvg()).toBe(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path transform="scale(2) rotate(45)" d="M0,0 L10,20"/><path transform="scale(2) translate(10, 20)" d="M0,10 L20,30"/></svg>'
    )
  })
})