const { SLICE } = require('../utils.js')

const RegReferencesUrl = /\burl\((("|')?#(.+?)\1)?\)/
/**
 * removeGradient 去除渐变 url('#id') 引用方法
 * @param {*} Doc
 */
const removeGradient = Doc => {
  SLICE.call(Doc.documentElement.childNodes).forEach(node => {
    if (node.nodeName.toUpperCase() === 'PATH') {
      if (
        node.hasAttribute('fill') &&
        RegReferencesUrl.test(node.getAttribute('fill'))
      ) {
        node.removeAttribute('fill')
      }
    }
  })
}

exports.fn = removeGradient
