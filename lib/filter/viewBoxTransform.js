const { SLICE } = require('../utils.js')
// const svgpath = require('svgpath')
// 变换转换
const { pathParse, serializePath } = require('svg-path-parse')

// const transformPath = pathD => svgpath(pathD)

let VIEWBox = [0, 0, 1024, 1024]

/**
 * transNode 递归遍历变换 path d值
 * @param {*} node
 */
const transNode = (Node, tranX, tranY, precent) => {
  SLICE.call(Node.childNodes).forEach(node => {
    if (node.nodeName.toUpperCase() === 'PATH') {
      if (node.hasAttribute) {
        if (node.hasAttribute('d')) {
          const pathd = node.getAttribute('d')
          // node.setAttribute(
          //   'd',
          //   transformPath(pathd)
          //     .translate(tranX, tranY)
          //     .scale(precent)
          //     .rel()
          //     .round(2)
          // )
          node.setAttribute(
            'd',
            serializePath(
              pathParse(pathd).relNormalize({
                round: 2,
                transform: `translate(${tranX}, ${tranY}) scale(${precent})`,
              })
            )
          )
        }

        // deal with stroke-width
        if (node.hasAttribute('stroke-width')) {
          const width = node.getAttribute('stroke-width')
          node.setAttribute('stroke-width', (width * precent).toFixed(2))
        }
      }
    } else if (node.hasChildNodes()) {
      transNode(node, tranX, tranY, precent)
    }
  })
}

const viewBoxTransform = (Doc, size) => {
  if (size - 0 > 0) {
    VIEWBox = [0, 0, size, size]
  }
  let viewBox =
    Doc.documentElement.getAttribute('viewbox') ||
    Doc.documentElement.getAttribute('viewBox')
  viewBox = viewBox.split(/\s+|,/).filter(t => t)
  const tranX = VIEWBox[0] - viewBox[0]
  const tranY = VIEWBox[1] - viewBox[1]
  let precent
  VIEWBox[2] / viewBox[2] - VIEWBox[3] / viewBox[3] < 0
    ? (precent = VIEWBox[2] / viewBox[2])
    : (precent = VIEWBox[3] / viewBox[3])

  transNode(Doc.documentElement, tranX, tranY, precent)

  Doc.documentElement.setAttribute('viewBox', VIEWBox.join(' '))
}

exports.fn = viewBoxTransform
