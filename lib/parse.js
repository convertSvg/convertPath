/* eslint-disable no-unused-vars */
'use strict'

const fs = require('fs')
const xmldom = require('xmldom')
const DOMParser = xmldom.DOMParser // 解析为文档对象
const XMLSerializer = xmldom.XMLSerializer // XML序列化
const convertShapeToPath = require('./filter/convertShapeToPath').fn
let Doc // 声明文档流对象

/**
 * [parse svg解析函数]
 * @return {[type]} [description]
 */
function parse (filePath) {
  try {
    Doc = new DOMParser().parseFromString(
      readToFile(filePath),
      'application/xml'
    )
  } catch (err) {
    console.log('解析失败', err)
  }
}

/**
 * [toSimpleSvg svg基本图形转换path]
 * @return {[type]} [description]
 */
function toSimpleSvg () {
  // console.info(Doc.documentElement)
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

  slice.call(Doc.documentElement.childNodes).forEach(function (node) {
    transNode(node, Doc)
  })

  // console.log("XMLSerializer", new XMLSerializer().serializeToString(Doc))
  return new XMLSerializer().serializeToString(Doc)
}

/*
 * [writeToFile description]
 * @param  {[type]} data [数组数据列表]
 * @param  {[type]} path [写入的路径]
 */
function writeToFile (data, path, calllback) {
  data = JSON.stringify(data, null, '\t')
  fs.writeFile(path, data, 'utf-8', function (err) {
    if (err) throw err
    calllback && calllback()
  })
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

module.exports = {
  parse,
  toSimpleSvg,
}
