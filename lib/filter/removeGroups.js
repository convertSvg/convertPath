const { SLICE } = require('../utils.js')

/**
 * transRemoveNode 递归遍历去除<g>
 * @param {*} node
 */
const transRemoveNode = node => {
  SLICE.call(node.attributes).map(attr => {
    SLICE.call(node.childNodes).map(item => {
      node.parentNode.replaceChild(item, node)
      if (!item.hasAttribute(attr.nodeName)) {
        item.setAttribute(attr.nodeName, attr.value)
      }
      if (item.nodeName.toUpperCase() === 'G' && item.hasChildNodes()) {
        transRemoveNode(item)
      }
    })
  })
  node.parentNode.removeChild(node)
}

/**
 * removeGroups 去除 <g> 插件方法
 * @param {*} Doc
 */
const removeGroups = Doc => {
  SLICE.call(Doc.documentElement.childNodes).forEach(node => {
    if (node.nodeName.toUpperCase() === 'G') {
      if (node.hasChildNodes()) {
        transRemoveNode(node)
      } else {
        node.parentNode.removeChild(node)
      }
    }
  })
}

exports.fn = removeGroups
