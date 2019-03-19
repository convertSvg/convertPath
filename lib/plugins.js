const convertShapeToPath = require('./filter/convertShapeToPath').fn
const removeGroups = require('./filter/removeGroups').fn

const pluginList = {
  convertShapeToPath,
  removeGroups,
}

const Dispatcher = (Doc, pluginArr = []) => {
  pluginArr.map(item => {
    if (Object.values(item)[0]) {
      pluginList[Object.keys(item)] && pluginList[Object.keys(item)](Doc)
    }
  })
}
module.exports = {
  Dispatcher,
}
