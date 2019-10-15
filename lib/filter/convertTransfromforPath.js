const { SLICE } = require('../utils.js')
const svgpath = require('svgpath') // 变换转换

const transformTypesReg = /matrix|translate|scale|rotate|skewX|skewY/
const transformSplitReg = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/
const numericValuesReg = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g

const parseTransform = transformString => {
  const transforms = []
  let current

  // split value into ['', 'translate', '10 50', '', 'scale', '2', '', 'rotate', '-45', '']
  transformString.split(transformSplitReg).forEach(item => {
    let num
    if (item) {
      // if item is a translate function
      if (transformTypesReg.test(item)) {
        // then collect it and change current context
        current = { name: item }
        transforms.push(current)
        // else if item is data
      } else {
        // then split it into [10, 50] and collect as context.data
        while ((num = numericValuesReg.exec(item))) {
          num = Number(num)
          if (current.data) {
            current.data.push(num)
          } else {
            current.data = [num]
          }
        }
      }
    }
  })

  // return empty array if broken transform (no data)
  return current && current.data ? transforms : []
}

/**
 * convertTransfromforPath 转换 Transfrom 插件
 * @param {*} Doc
 */
const convertTransfromforPath = Doc => {
  SLICE.call(Doc.documentElement.childNodes).forEach(node => {
    if (node.nodeName.toUpperCase() === 'PATH') {
      const D = node.getAttribute('d')
      // 移除 path d 为空的数据
      if (!D) {
        node.parentNode.removeChild(node)
        return
      }
      if (node.hasAttribute('transform')) {
        const transformArr = parseTransform(node.getAttribute('transform'))
        const transformObj = svgpath(D)
        transformArr.map(item => {
          transformObj[item.name](...item.data)
        })

        const transformStr = transformObj
          .rel()
          .round(2)
          .toString()
        node.removeAttribute('transform')
        node.setAttribute('d', transformStr)
      }
    }
  })
}

exports.fn = convertTransfromforPath
