const { SLICE } = require('../utils.js')

/**
 * transRemoveNode 递归遍历去除<g>
 * @param {*} node
 */
const transRemoveNode = node => {
  const ATTR = SLICE.call(node.attributes)
  if (ATTR.length > 0) {
    ATTR.map(attr => {
      SLICE.call(node.childNodes).map(item => {
        node.parentNode.insertBefore(item, node)
        if (item.hasAttribute && !item.hasAttribute(attr.nodeName)) {
          item.setAttribute(attr.nodeName, attr.value)
        }
        if (item.nodeName.toUpperCase() === 'G' && item.hasChildNodes()) {
          transRemoveNode(item)
        }
      })
    })
  } else {
    SLICE.call(node.childNodes).map(item => {
      node.parentNode.insertBefore(item, node)
    })
  }

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
