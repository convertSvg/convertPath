## convertPath [![npm](https://img.shields.io/badge/npm-convertpath-green.svg?style=flat-square)](https://www.npmjs.com/package/convertpath)

A node lib to convert svg shape elements into path svg elements.

## Install

```
npm install convertpath
```

## What it can do

convertpath has a plugin-based architecture, so almost every optimization is a separate plugin.

Today we have:

| Plugin                                                                                                              | Description                                                              |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [convertUseToGroup](https://github.com/pfan123/convertpath/blob/master/lib/filter/convertUseToGroup.js)             | convert defs and symbol elements into group svg elements.                |
|                                                                                                                     |
| [convertShapeToPath](https://github.com/pfan123/convertpath/blob/master/lib/filter/convertShapeToPath.js)           | convert svg shape elements into path svg elements.                       |
| [removeGroups](https://github.com/pfan123/convertpath/blob/master/lib/filter/removeGroups.js)                       | move some group and move some group attributes to the contained elements |
| [convertTransfromforPath](https://github.com/pfan123/convertpath/blob/master/lib/filter/convertTransfromforPath.js) | remove transform attribute and convert path data to relative             |
| [removeGradient](https://github.com/pfan123/convertpath/blob/master/lib/filter/removeGradient.js)                   | remove gradient if reference via url('#id')                              |
| [viewBoxTransform](https://github.com/pfan123/convertpath/blob/master/lib/filter/viewBoxTransform.js)               | remove width/height attributes and reset ViewBox                         |

## Usage

```
const SVGParser = require('convertpath')

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

/**
 * '<circle cx="500" cy="500" r="20" fill="red"/>'
 */
console.log(parse.toSimpleSvg())

/**
 * '<path d="M500,500,m-20,0,a20,20,0,1,0,40,0,a20,20,0,1,0,-40,0,Z" fill="red"/>'
 */

```

## API

#### SVGParser.parse(filename)

#### SVGParser.parseStr(svgString)

#### SVGParser.parseNode(node)

#### parse.toSimpleSvg()

#### parse.getPathAttributes

## WIKI

[SVG WIKI](https://github.com/convertSvg/convertPath/wiki)

## CHANGELOG

[CHANGELOG.md](https://github.com/convertSvg/convertPath/blob/master/CHANGELOG.md)

## Special thanks

- [SVGO](https://github.com/svg/svgo)
- [fontello](https://github.com/fontello/svgpath)
- [W3C SVG11](https://www.w3.org/TR/SVG11/)
