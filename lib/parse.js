'use strict'
const xmldom = require('xmldom')
const DOMParser = xmldom.DOMParser // 解析为文档对象
const XMLSerializer = xmldom.XMLSerializer // XML序列化
const minify = require('html-minifier').minify

const { readToFile, SLICE } = require('./utils.js')

// 插件处理机制
const { Dispatcher } = require('./plugins.js')

const minifySvg = dataStr => {
  return minify(dataStr, {
    collapseWhitespace: true,
    removeComments: true,
  })
}

class SVGParser {
  /**
   * [parse svg 文件解析函数]
   * @param {*} filePath plugins [{}]
   */
  parse (filePath, confing) {
    try {
      this.Doc = new DOMParser().parseFromString(
        minifySvg(readToFile(filePath)),
        'application/xml'
      )
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
        minifySvg(dataStr),
        'application/xml'
      )
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
          if (attr.nodeName.toUpperCase() === 'D') pathObj.d = attr.value
          if (attr.nodeName.toUpperCase() === 'FILL') pathObj.fill = attr.value
        })
        paths.push(pathObj)
      }
    })

    return paths
  }
}

module.exports = new SVGParser()
