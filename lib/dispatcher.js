const convertShapeToPath = require('./filter/convertShapeToPath').fn
const removeGroups = require('./filter/removeGroups').fn
const viewBoxTransform = require('./filter/viewBoxTransform').fn

const pluginList = {
  convertShapeToPath,
  removeGroups,
  viewBoxTransform,
}

/**
 * 插件解析分发机制 Dispatcher
 * convertShapeToPath 基本图形转换为 path
 * removeGroups 基本图形转换为 path
 */
const Dispatcher = (Doc, { plugins = [], size }) => {
  plugins.map(item => {
    if (Object.values(item)[0]) {
      pluginList[Object.keys(item)] && pluginList[Object.keys(item)](Doc, size)
    }
  })
}

module.exports = {
  Dispatcher,
}
