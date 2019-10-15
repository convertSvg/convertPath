const { SLICE } = require('../utils.js')

/**
 * transRemoveNode 递归遍历去除<g>
 * @example
 * <g transform="scale(2)">
 *     <path transform="rotate(45)" d="M0,0 L10,20"/>
 *     <path transform="translate(10, 20)" d="M0,10 L20,30"/>
 * </g>
 *                          ⬇
 * <path transform="scale(2) rotate(45)" d="M0,0 L10,20"/>
 * <path transform="scale(2) translate(10, 20)" d="M0,10 L20,30"/>
 * @param {*} node
 */
const transRemoveNode = node => {
  const ATTR = SLICE.call(node.attributes)

  SLICE.call(node.childNodes).map(item => {
    if (ATTR.length > 0) {
      ATTR.map(attr => {
        if (attr.nodeName.toLowerCase() === 'transform') {
          let transfromStr = attr.value

          if (item.hasAttribute('transform')) {
            transfromStr += ` ${item.getAttribute('transform')}`
          }

          item.setAttribute(attr.nodeName, transfromStr)
        }

        if (
          item.hasAttribute &&
          !item.hasAttribute(attr.nodeName) &&
          attr.nodeName.toLowerCase() !== 'transform'
        ) {
          item.setAttribute(attr.nodeName, attr.value)
        }
      })
    }

    // 除了 <g></g> 以外都 insert Node
    if (!(item.nodeName.toUpperCase() === 'G' && !item.hasChildNodes())) {
      node.parentNode.insertBefore(item, node)
    }

    if (item.nodeName.toUpperCase() === 'G' && item.hasChildNodes()) {
      transRemoveNode(item)
    }
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
        // empty
        node.parentNode.removeChild(node)
      }
    }
  })
}

exports.fn = removeGroups
