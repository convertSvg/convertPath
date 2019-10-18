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
| [convertShapeToPath](https://github.com/pfan123/convertpath/blob/master/lib/filter/convertShapeToPath.js)           | convert svg shape elements into path svg elements.                       |
| [removeGroups](https://github.com/pfan123/convertpath/blob/master/lib/filter/removeGroups.js)                       | move some group and move some group attributes to the contained elements |
| [viewBoxTransform](https://github.com/pfan123/convertpath/blob/master/lib/filter/viewBoxTransform.js)               | remove width/height attributes and reset ViewBox                         |
| [convertTransfromforPath](https://github.com/pfan123/convertpath/blob/master/lib/filter/convertTransfromforPath.js) | remove transform attribute and convert path data to relative             |

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
      convertTransfromforPath: true,
    },
    {
      viewBoxTransform: true, // 必须放到最后
    },
  ],
  size: 1000, // default 1024
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

## Special thanks

- [SVGO](https://github.com/svg/svgo)
- [fontello](https://github.com/fontello/svgpath)
- [W3C SVG11](https://www.w3.org/TR/SVG11/)

`注意：`

- 1.svg 区分大小写， 如 `viewBox` 与 `viewbox`, `minify` 压缩会导致 `viewBox` 变成小写
- 2.`stroke-width` 属性指定了当前对象的轮廓的宽度。它的默认值是 1。如果使用了一个 `<percentage>`，这个值代表当前视口的百分比。如果使用了 0 值，则将不绘制轮廓。`viewBox` 变更 `stroke-width` 也需要变更。
