'use strict'
const fs = require('fs')
const SLICE = Array.prototype.slice

/*
 * [writeToFile description]
 * @param  {[type]} data [数组数据列表]
 * @param  {[type]} path [写入的路径]
 */
// eslint-disable-next-line no-unused-vars
function writeToFile (data, path, calllback) {
  data = JSON.stringify(data, null, '\t')
  fs.writeFile(path, data, 'utf-8', function (err) {
    if (err) throw err
    calllback && calllback()
  })
}

/*
 * [readToFile 读取文件]
 * @param  {[type]} path [读取路径]
 */
function readToFile (path, calllback) {
  const data = fs.readFileSync(path, 'UTF-8')
  calllback && calllback()
  return data
}

module.exports = {
  writeToFile,
  readToFile,
  SLICE,
}
