'use strict'
const xmldom = require('xmldom')
const DOMParser = xmldom.DOMParser // 解析为文档对象
const XMLSerializer = xmldom.XMLSerializer // XML序列化
const juice = require('juice')
const minify = require('html-minifier').minify
const { readToFile, SLICE } = require('./utils.js')

// 插件处理机制
const { Dispatcher } = require('./dispatcher.js')

const minifySvg = dataStr => {
  return minify(dataStr, {
    collapseWhitespace: true,
    removeComments: true,
  })
}

/**
 * 修正去除额外字段
 * minify 压缩 svg 引起的 viewBox 变成 viewbox 问题
 */
const fixExtraFiled = Doc => {
  if (Doc.documentElement.getAttribute('viewbox')) {
    Doc.documentElement.setAttribute(
      'viewBox',
      Doc.documentElement.getAttribute('viewbox')
    )
    Doc.documentElement.removeAttribute('viewbox')
  }
}

class SVGParser {
  /**
   * [parse svg 文件解析函数]
   * @param {*} filePath plugins [{}]
   */
  parse (filePath, confing) {
    try {
      this.Doc = new DOMParser().parseFromString(
        juice(minifySvg(readToFile(filePath))),
        'application/xml'
      )
      fixExtraFiled(this.Doc)
      if (this.Doc.documentElement.tagName.toUpperCase() !== 'SVG') {
        console.log('解析失败')
      }
    } catch (err) {
      console.log('解析失败', err)
    }

    // 插件解析 svg
    Dispatcher(this.Doc, confing)
    return this
  }

  /**
   * [parse svg 字符串解析函数]
   * @param {*} dataStr
   */
  parseStr (dataStr, confing) {
    try {
      this.Doc = new DOMParser().parseFromString(
        juice(minifySvg(dataStr)),
        'application/xml'
      )
      fixExtraFiled(this.Doc)
      if (this.Doc.documentElement.tagName.toUpperCase() !== 'SVG') {
        console.log('解析失败')
      }
    } catch (err) {
      console.log('解析失败', err)
    }
    Dispatcher(this.Doc, confing)
    return this
  }

  /**
   * [parse svg 节点解析函数]
   * @param {*} Node
   */
  parseNode (Node, confing) {
    this.Doc = Node
    fixExtraFiled(this.Doc)
    Dispatcher(this.Doc, confing)
    return this
  }

  /**
   * [toSimpleSvg svg基本图形转换path]
   * @return {[type]} [description]
   */
  toSimpleSvg () {
    return new XMLSerializer().serializeToString(this.Doc)
  }

  /**
   * getPathAttributes 获取 svg 中 path 属性
   * @returns
   * @memberof SVGParser
   */
  getPathAttributes () {
    const Node = this.Doc
    const paths = []
    SLICE.call(Node.documentElement.childNodes).forEach((node, index) => {
      const pathObj = {}
      pathObj.pid = index
      if (node.nodeName.toUpperCase() === 'PATH') {
        SLICE.call(node.attributes).forEach(attr => {
          if (attr.value) pathObj[attr.nodeName.toLowerCase()] = attr.value
        })
        paths.push(pathObj)
      }
    })

    return paths
  }
}

module.exports = new SVGParser()
