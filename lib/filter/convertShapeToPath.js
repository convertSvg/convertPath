'use strict'

const reNum = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g

/**
 * [generatePathNode 获得替换后的path节点]
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
function generatePathNode (node, Doc) {
  const newPathNode = Doc.createElement('path')
  const slice = Array.prototype.slice

  slice.call(node.attributes).forEach(attribute => {
    newPathNode.setAttribute(attribute.name, attribute.value)
  })

  return newPathNode
}

exports.fn = function (node, Doc) {
  if (!node.tagName) {
    return
  }

  const tagName = String(node.tagName).toLowerCase()
  const newPathNode = generatePathNode(node, Doc)
  let path = ''
  let attrsToRomove = []

  switch (tagName) {
    case 'rect': {
      const x = Number(node.getAttribute('x'))
      const y = Number(node.getAttribute('y'))
      const width = Number(node.getAttribute('width'))
      const height = Number(node.getAttribute('height'))

      /*
      * rx 和 ry 的规则是：
      * 1. 如果其中一个设置为 0 则圆角不生效
      * 2. 如果有一个没有设置则取值为另一个
      * 3.rx 的最大值为 width 的一半, ry 的最大值为 height 的一半
      */
      let rx = Number(node.getAttribute('rx')) || Number(node.getAttribute('ry')) || 0
      let ry = Number(node.getAttribute('ry')) || Number(node.getAttribute('rx')) || 0

      // 非数值单位计算，如当宽度像100%则移除
      // if (isNaN(x - y + width - height + rx - ry)) return;

      rx = rx > (width / 2) ? (width / 2) : rx
      ry = ry > (height / 2) ? (height / 2) : ry

      // 如果其中一个设置为 0 则圆角不生效
      path = (rx === 0 || ry === 0) ? [
        `M${x} ${y + ry}`,
        `a${rx} ${ry} 0 0 1 ${rx} ${-ry}`,
        `h${width - rx - rx}`,
        `a${rx} ${ry} 0 0 1 ${rx} ${ry}`,
        `v${height - ry - ry}`,
        `a${rx} ${ry} 0 0 1 ${-rx} ${ry}`,
        `h${rx + rx - width}`,
        `a${rx} ${ry} 0 0 1 ${-rx} ${-ry}`,
        'z'
      ].join('') : [
        `M${x} ${y + ry}`,
        `a${rx} ${ry} 0 0 1 ${rx} ${-ry}`,
        `h${width - rx - rx}`,
        `a${rx} ${ry} 0 0 1 ${rx} ${ry}`,
        `v${height - ry - ry}`,
        `a${rx} ${ry} 0 0 1 ${-rx} ${ry}`,
        `h${rx + rx - width}`,
        `a${rx} ${ry} 0 0 1 ${-rx} ${-ry}`,
        'z'
      ].join('')

      attrsToRomove = ['x', 'y', 'width', 'height', 'rx', 'ry']
      break
    }

    case 'circle': {
      const cx = Number(node.getAttribute('cx'))
      const cy = Number(node.getAttribute('cy'))
      const r = Number(node.getAttribute('r'))

      path = [
        `M${cx - r} ${cy}`,
        `a${r} ${r} 0 1 0 ${2 * r} 0`,
        `a${r} ${r} 0 1 0 ${-2 * r} 0`,
        'z'
      ].join('')

      attrsToRomove = ['cx', 'cy', 'r']
      break
    }

    case 'ellipse': {
      const cx = Number(node.getAttribute('cx'))
      const cy = Number(node.getAttribute('cy'))
      const rx = Number(node.getAttribute('rx'))
      const ry = Number(node.getAttribute('ry'))

      if (!isNaN(cx - cy + rx - ry)) {
        path = [
          `M${cx - rx} ${cy}`,
          `a${rx} ${ry} 0 1 0 ${2 * rx} 0`,
          `a${rx} ${ry} 0 1 0 ${-2 * rx} 0`,
          'z'
        ].join('')

        attrsToRomove = ['cx', 'cy', 'rx', 'ry']
      }

      break
    }

    case 'line': {
      const x1 = Number(node.getAttribute('x1'))
      const y1 = Number(node.getAttribute('y1'))
      const x2 = Number(node.getAttribute('x2'))
      const y2 = Number(node.getAttribute('y2'))

      if (!isNaN(x1 - y1 + x2 - y2)) {
        path = `M${x1} ${y1}L${x2} ${y2}`
        attrsToRomove = ['x1', 'y1', 'x2', 'y2']
      }

      break
    }

    // ploygon 与 polyline 是一样的
    // polygon 多边形，polyline 折线
    case 'polygon':
    case 'polyline': {
      const points = (node.getAttribute('points').match(reNum) || []).map(i => Number(i))

      if (points.length >= 4) {
        const [a, b, c, d] = points
        path = [
          `M${a} ${b}`,
          `L${c} ${d}`,
          (tagName === 'polygon' ? 'z' : '')
        ].join('')

        newPathNode.removeAttribute('points')
      }

      break
    }
  }

  newPathNode.setAttribute('d', path)
  attrsToRomove.forEach(attr => newPathNode.removeAttribute(attr))
  node.parentNode.replaceChild(newPathNode, node)
}
