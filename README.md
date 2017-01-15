## convertpath[![npm](https://img.shields.io/badge/npm-convertpath-green.svg?style=flat-square)](https://www.npmjs.com/package/convertpath)

A node lib to convert svg shape elements into path svg elements.

## Install

```
npm install convertpath
```

## Usage

```
const parse = require('convertpath');

parse.parse("./test/test.svg")
/**
 * '<circle cx="500" cy="500" r="20" fill="red"/>'
 */
console.log(parse.toSimpleSvg())

/**
 * '<path d="M500,500,m-20,0,a20,20,0,1,0,40,0,a20,20,0,1,0,-40,0,Z" fill="red"/>'
 */

```