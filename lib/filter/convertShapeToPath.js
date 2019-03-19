/* eslint-disable no-redeclare */
'use strict'
const { SLICE } = require('../utils.js')

const regNumber = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g

/**
 * [generatePathNode 获得替换后的path节点]
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
function generatePathNode (node, Doc) {
  const newPathNode = Doc.createElement('path')
  const slice = Array.prototype.slice
  slice.call(node.attributes).forEach(function (attribute) {
    newPathNode.setAttribute(attribute.name, attribute.value)
  })

  return newPathNode
}

function convertPathData (node, Doc) {
  if (!node.tagName) return
  const tagName = String(node.tagName).toLowerCase()

  switch (tagName) {
    case 'rect':
      const x = Number(node.getAttribute('x'))
      const y = Number(node.getAttribute('y'))
      const width = Number(node.getAttribute('width'))
      var height = Number(node.getAttribute('height'))
      /*
       * rx 和 ry 的规则是：
       * 1. 如果其中一个设置为 0 则圆角不生效
       * 2. 如果有一个没有设置则取值为另一个
       * 3.rx 的最大值为 width 的一半, ry 的最大值为 height 的一半
       */
      var rx =
        Number(node.getAttribute('rx')) || Number(node.getAttribute('ry')) || 0
      var ry =
        Number(node.getAttribute('ry')) || Number(node.getAttribute('rx')) || 0

      // 非数值单位计算，如当宽度像100%则移除
      // if (isNaN(x - y + width - height + rx - ry)) return;

      rx = rx > width / 2 ? width / 2 : rx
      ry = ry > height / 2 ? height / 2 : ry

      // 如果其中一个设置为 0 则圆角不生效
      if (rx == 0 || ry == 0) {
        // var path =
        //     'M' + x + ' ' + y +
        //     'H' + (x + width) +
        //     'V' + (y + height) +
        //     'H' + x +
        //     'z';
        var path =
          'M' + x + ' ' + y + 'h' + width + 'v' + height + 'h' + -width + 'z'
      } else {
        var path =
          'M' +
          x +
          ' ' +
          (y + ry) +
          'a' +
          rx +
          ' ' +
          ry +
          ' 0 0 1 ' +
          rx +
          ' ' +
          -ry +
          'h' +
          (width - rx - rx) +
          'a' +
          rx +
          ' ' +
          ry +
          ' 0 0 1 ' +
          rx +
          ' ' +
          ry +
          'v' +
          (height - ry - ry) +
          'a' +
          rx +
          ' ' +
          ry +
          ' 0 0 1 ' +
          -rx +
          ' ' +
          ry +
          'h' +
          (rx + rx - width) +
          'a' +
          rx +
          ' ' +
          ry +
          ' 0 0 1 ' +
          -rx +
          ' ' +
          -ry +
          'z'
      }

      var newPathNode = generatePathNode(node, Doc)
      newPathNode.setAttribute('d', path)
      ;['x', 'y', 'width', 'height', 'rx', 'ry'].forEach(function (attribute) {
        newPathNode.removeAttribute(attribute)
      })
      node.parentNode.replaceChild(newPathNode, node)

      break

    case 'circle':
      var cx = node.getAttribute('cx')
      var cy = node.getAttribute('cy')
      var r = node.getAttribute('r')
      var path =
        'M' +
        (cx - r) +
        ' ' +
        cy +
        'a' +
        r +
        ' ' +
        r +
        ' 0 1 0 ' +
        2 * r +
        ' 0' +
        'a' +
        r +
        ' ' +
        r +
        ' 0 1 0 ' +
        -2 * r +
        ' 0' +
        'z'

      var newPathNode = generatePathNode(node, Doc)
      newPathNode.setAttribute('d', path)
      ;['cx', 'cy', 'r'].forEach(function (attribute) {
        newPathNode.removeAttribute(attribute)
      })
      node.parentNode.replaceChild(newPathNode, node)

      break

    case 'ellipse':
      var cx = node.getAttribute('cx')
      var cy = node.getAttribute('cy')
      var rx = node.getAttribute('rx')
      var ry = node.getAttribute('ry')
      if (isNaN(cx - cy + rx - ry)) return
      var path =
        'M' +
        (cx - rx) +
        ' ' +
        cy +
        'a' +
        rx +
        ' ' +
        ry +
        ' 0 1 0 ' +
        2 * rx +
        ' 0' +
        'a' +
        rx +
        ' ' +
        ry +
        ' 0 1 0 ' +
        -2 * rx +
        ' 0' +
        'z'

      var newPathNode = generatePathNode(node, Doc)
      newPathNode.setAttribute('d', path)
      ;['cx', 'cy', 'rx', 'ry'].forEach(function (attribute) {
        newPathNode.removeAttribute(attribute)
      })
      node.parentNode.replaceChild(newPathNode, node)

      break

    case 'line':
      var x1 = node.getAttribute('x1')
      var y1 = node.getAttribute('y1')
      var x2 = node.getAttribute('x2')
      var y2 = node.getAttribute('y2')
      if (isNaN(x1 - y1 + (x2 - y2))) {
        return
      }

      var path = 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2
      var newPathNode = generatePathNode(node, Doc)
      newPathNode.setAttribute('d', path)
      ;['x1', 'y1', 'x2', 'y2'].forEach(function (attribute) {
        newPathNode.removeAttribute(attribute)
      })
      node.parentNode.replaceChild(newPathNode, node)

      break

    case 'polygon':
    case 'polyline': // ploygon与polyline是一样的,polygon多边形，polyline折线
      var points = (node.getAttribute('points').match(regNumber) || []).map(
        Number
      )
      if (points.length < 4) {
        return
      }
      var path =
        'M' +
        points.slice(0, 2).join(' ') +
        'L' +
        points.slice(2).join(' ') +
        (tagName === 'polygon' ? 'z' : '')

      var newPathNode = generatePathNode(node, Doc)
      newPathNode.setAttribute('d', path)
      newPathNode.removeAttribute('points')
      node.parentNode.replaceChild(newPathNode, node)

      break
  }
}

/**
 * transRemoveNode 递归遍历转换基本图形
 * @param {*} node
 */
function transNode (node, Doc) {
  // 基本的图形都不含有子结点
  if (!node.hasChildNodes() && node.nodeName.toUpperCase() !== 'PATH') {
    convertPathData(node, Doc)
  } else if (node.hasChildNodes()) {
    SLICE.call(node.childNodes).forEach(function (item) {
      transNode(item, Doc)
    })
  }
}

/**
 * convertShapeToPath 基本图形转换
 * 包含 rect、cricle、ellipse、line、polygon、polyline
 * @param {*} Doc
 */
exports.fn = function convertShapeToPath (Doc) {
  SLICE.call(Doc.documentElement.childNodes).forEach(node => {
    transNode(node, Doc)
  })
}
