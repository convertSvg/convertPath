const dir = process.cwd()
const path = require('path')
const SVGParser = require(path.join(dir, 'lib/index'))
const convertShapeToPath = require(path.join(
  dir,
  'lib/filter/convertShapeToPath'
)).fn

describe('convert defs and symbol elements into group svg elements', () => {
  test('convert circle shape elements into path', () => {
    const parse = SVGParser.parseStr(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><circle cx="500" cy="500" r="20" fill="red"/></svg>',
      {}
    )
    convertShapeToPath(parse.Doc)
    expect(parse.toSimpleSvg()).toBe(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="red" d="M480 500a20 20 0 1 0 40 0a20 20 0 1 0 -40 0z"/></svg>'
    )
  })

  test('convert rect shape elements into path', () => {
    const parse = SVGParser.parseStr(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect x="50" y="50" width="100" height="100" stroke="#666" fill="#fff"></rect></svg>',
      {}
    )
    convertShapeToPath(parse.Doc)
    expect(parse.toSimpleSvg()).toBe(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path stroke="#666" fill="#fff" d="M50 50h100v100h-100z"/></svg>'
    )
  })

  test('convert ellipse shape elements into path', () => {
    const parse = SVGParser.parseStr(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><ellipse rx="40" ry="20" cx="200" cy="500" fill="blue"></ellipse></svg>',
      {}
    )
    convertShapeToPath(parse.Doc)
    expect(parse.toSimpleSvg()).toBe(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="blue" d="M160 500a40 20 0 1 0 80 0a40 20 0 1 0 -80 0z"/></svg>'
    )
  })

  test('convert polygon shape elements into path', () => {
    const parse = SVGParser.parseStr(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon points="200,200 300,300 400,200" fill="orange"/></svg>',
      {}
    )
    convertShapeToPath(parse.Doc)
    expect(parse.toSimpleSvg()).toBe(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="orange" d="M200 200L300 300 400 200z"/></svg>'
    )
  })

  test('convert polyline shape elements into path', () => {
    const parse = SVGParser.parseStr(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><polyline points="100 200, 20 180, 180 180, 180 20" fill="orange" stroke="#000"/></svg>',
      {}
    )
    convertShapeToPath(parse.Doc)
    expect(parse.toSimpleSvg()).toBe(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="orange" stroke="#000" d="M100 200L20 180 180 180 180 20"/></svg>'
    )
  })

  test('convert line shape elements into path', () => {
    const parse = SVGParser.parseStr(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><line x1="20" y1="20" x2="180" y2="180" stroke="orange"></line></svg>',
      {}
    )
    convertShapeToPath(parse.Doc)
    expect(parse.toSimpleSvg()).toBe(
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path stroke="orange" d="M20 20L180 180"/></svg>'
    )
  })
})
