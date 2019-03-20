## convertpath [![npm](https://img.shields.io/badge/npm-convertpath-green.svg?style=flat-square)](https://www.npmjs.com/package/convertpath)

A node lib to convert svg shape elements into path svg elements.

## Install

```
npm install convertpath
```

## What it can do

convertpath has a plugin-based architecture, so almost every optimization is a separate plugin.

Today we have:

| Plugin                                                                            | Description                                                              |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| convertShapeToPath                                                                | convert svg shape elements into path svg elements.                       |
| removeGroups                                                                      | move some group and move some group attributes to the contained elements |
| viewBoxTransform(https://github.com/svg/svgo/blob/master/plugins/inlineStyles.js) | remove width/height attributes and reset ViewBox                         |

## Usage

```
const SVGParser = require('convertpath')

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
  size: 1000, default 1024
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

`注意：`svg 区分大小写， 如 viewBox 与 viewbox, minify 压缩会导致 viewBox 变成小写
