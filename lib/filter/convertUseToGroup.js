const { SLICE } = require('../utils.js')

/**
 * convertUseToGroup 转换 use 标签为 g 标签 插件
 * 注意 symbol 标签 无 tranform 属性，含 viewBox 属性
 * @param {*} Doc
 */
const convertUseToGroup = Doc => {
  const symbolNodes = new Set([])
  SLICE.call(Doc.documentElement.childNodes).forEach(node => {
    if (node.nodeName.toUpperCase() === 'USE') {
      const useID = node.getAttribute('xlink:href').replace('#', '')
      let symbolNode = Doc.getElementById(useID)
      symbolNodes.add(useID)
      if (symbolNode) {
        const group = Doc.createElement('g')
        const attributes = SLICE.call(node.attributes)

        if (attributes.length > 0) {
          let transform = ''
          let x = 0
          let y = 0
          if (node.hasAttributes('x')) x = node.getAttribute('x') || 0
          if (node.hasAttributes('y')) y = node.getAttribute('y') || 0
          if (node.hasAttributes('transform')) { transform = node.getAttribute('transform') }

          if (x != 0 && y != 0) transform += ` translate(${x}, ${y})`

          if (transform) {
            group.setAttribute(
              'transform',
              transform.replace(/(^\s+|\s+$)/g, '')
            )
          }
          node.removeAttribute('x')
          node.removeAttribute('y')
          node.removeAttribute('y')
          node.removeAttribute('xlink:href')
          node.removeAttribute('style')

          SLICE.call(node.attributes).map(({ nodeName, value }) => {
            group.setAttribute(nodeName, value)
          })
        }

        if (symbolNode.nodeName.toUpperCase() === 'SYMBOL') {
          const newSymbol = symbolNode.cloneNode(true)
          const symbolGroup = Doc.createElement('g')
          symbolNode.removeAttribute('transform')
          symbolNode.removeAttribute('viewBox')
          SLICE.call(symbolNode.attributes).map(({ nodeName, value }) => {
            symbolGroup.setAttribute(nodeName, value)
          })

          SLICE.call(newSymbol.childNodes).map(path => {
            symbolGroup.appendChild(path)
          })
          symbolNode = symbolGroup
        }

        group.appendChild(symbolNode.cloneNode(true))

        node.parentNode.replaceChild(group, node)
      }
    }
  })

  symbolNodes.forEach(id => {
    const node = Doc.getElementById(id)
    if (node.nodeName.toUpperCase() === 'SYMBOL') {
      node.parentNode.removeChild(node)
    } else if (node.parentNode.nodeName.toUpperCase() === 'DEFS') {
      node.parentNode.removeChild(node)
    }
  })
}

exports.fn = convertUseToGroup
