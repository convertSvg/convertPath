const convertShapeToPath = require('./filter/convertShapeToPath').fn
const removeGroups = require('./filter/removeGroups').fn

const pluginList = {
  convertShapeToPath,
  removeGroups,
}

/**
 * 插件解析分发机制 Dispatcher
 * convertShapeToPath 基本图形转换为 path
 * removeGroups 基本图形转换为 path
 */
const Dispatcher = (Doc, { plugins = [] }) => {
  plugins.map(item => {
    if (Object.values(item)[0]) {
      pluginList[Object.keys(item)] && pluginList[Object.keys(item)](Doc)
    }
  })
}

module.exports = {
  Dispatcher,
}
