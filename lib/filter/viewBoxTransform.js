const { SLICE } = require('../utils.js')
const svgpath = require('svgpath') // 变换转换

const transformPath = pathD => svgpath(pathD)

let VIEWBox = [0, 0, 1024, 1024]

/**
 * transNode 递归遍历变换 path d值
 * @param {*} node
 */
const transNode = (Node, tranX, tranY, percent) => {
  SLICE.call(Node.childNodes).forEach(node => {
    if (node.nodeName.toUpperCase() === 'PATH') {
      if (node.hasAttribute) {
        if (node.hasAttribute('d')) {
          const pathd = node.getAttribute('d')
          node.setAttribute(
            'd',
            transformPath(pathd)
              .translate(tranX, tranY)
              .scale(percent)
              .rel()
              .round(2)
          )
        }

        // deal with stroke-width
        if (node.hasAttribute('stroke-width')) {
          const width = node.getAttribute('stroke-width')
          node.setAttribute('stroke-width', (width * percent).toFixed(2))
        }
      }
    } else if (node.hasChildNodes()) {
      transNode(node, tranX, tranY, percent)
    }
  })
}

const viewBoxTransform = (Doc, size, center) => {
  if (size - 0 > 0) {
    VIEWBox = [0, 0, size, size]
  }
  let viewBox =
    Doc.documentElement.getAttribute('viewbox') ||
    Doc.documentElement.getAttribute('viewBox')
  viewBox = viewBox.split(/\s+|,/).filter(t => t)

  const xScale = size / viewBox[2]
  const yScale = size / viewBox[3]

  const percent = Math.min(xScale, yScale)

  const translateX = xScale > yScale

  const translate = Math.abs(viewBox[2] - viewBox[3]) / 2

  let tranX = translateX ? translate : 0
  let tranY = translateX ? 0 : translate

  if (!center) {
    tranX = VIEWBox[0] - viewBox[0]
    tranY = VIEWBox[1] - viewBox[1]
  }

  transNode(Doc.documentElement, tranX, tranY, percent)

  Doc.documentElement.setAttribute('viewBox', VIEWBox.join(' '))
}

exports.fn = viewBoxTransform
