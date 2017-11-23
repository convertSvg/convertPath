'use strict'

const fs = require('fs')
const { DOMParser, XMLSerializer } = require('xmldom')
const convertShapeToPath = require('./filter/convertShapeToPath').fn

// 声明文档流对象
let Doc = null

module.exports = {
  parse: parse,
  toSimpleSvg: toSimpleSvg
}

/**
 * [parse svg解析函数]
 * @return {[type]} [description]
 */
function parse (filePath) {
  try {
    Doc = new DOMParser().parseFromString(readToFile(filePath), 'application/xml')
  } catch (err) {
    console.log('解析失败', err)
  }
}

/**
 * [toSimpleSvg svg基本图形转换path]
 * @return {[type]} [description]
 */
function toSimpleSvg () {
  const slice = Array.prototype.slice

  // 递归转换
  function transNode (node, Doc) {
    // 基本的图形都不含有子结点
    if (!node.hasChildNodes() && node.nodeName !== 'path') {
      convertShapeToPath(node, Doc)
    } else if (node.hasChildNodes()) {
      slice.call(node.childNodes).forEach(function (item) {
        transNode(item, Doc)
      })
    }
  }

  slice.call(Doc.documentElement.childNodes).forEach(node => {
    transNode(node, Doc)
  })

  return new XMLSerializer().serializeToString(Doc)
}

/*
* [readToFile 读取文件]
* @param  {[type]} path [读取路径]
*/
function readToFile (path, calllback) {
  const data = fs.readFileSync(path, 'UTF-8')
  calllback && calllback()
  return data
}
