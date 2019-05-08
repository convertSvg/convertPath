const convertShapeToPath = require('./filter/convertShapeToPath').fn
const removeGroups = require('./filter/removeGroups').fn
const viewBoxTransform = require('./filter/viewBoxTransform').fn

let defaultSize = 1024 // 默认转换 viewbox尺寸

const pluginList = {
  convertShapeToPath: (ctx, next) => {
    convertShapeToPath(ctx)
    next()
  },
  removeGroups: (ctx, next) => {
    removeGroups(ctx)
    next()
  },
  viewBoxTransform: (ctx, next) => {
    viewBoxTransform(ctx, defaultSize)
    next()
  },
}

/** 插件分发器
 * inspire https://github.com/koajs/compose
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware 插件中间件队列
 * @return {Function}
 * @api public
 * @todo compose([a, b, c, ...])
 */
function Compose (middleware) {
  if (!Array.isArray(middleware)) { throw new TypeError('Middleware stack must be an array!') }
  for (const fn of middleware) {
    if (typeof fn !== 'function') { throw new TypeError('Middleware must be composed of functions!') }
  }

  return function (context, next) {
    // last called middleware #
    // eslint-disable-next-line no-unused-vars
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      index = i
      let fn = middleware[i]
      if (i === middleware.length) {
        fn = next
      }
      if (!fn) return
      try {
        return fn(context, dispatch.bind(null, i + 1))
      } catch (err) {
        // log
        console.error(err)
        return dispatch.bind(null, i + 1)()
      }
    }
  }
}

/**
 * 插件解析分发机制 Dispatcher
 * convertShapeToPath 基本图形转换为 path
 * removeGroups 基本图形转换为 path
 */
const Dispatcher = (Doc, { plugins = [], size }) => {
  defaultSize = 1024 // 重置默认转换 viewbox尺寸
  if (size) defaultSize = size
  // 插件队列
  const middleware = []

  plugins.map(item => {
    if (Object.values(item)[0]) {
      middleware.push(pluginList[Object.keys(item)])
    }
  })

  // 执行插件分发器
  if (middleware.length > 0) Compose(middleware)(Doc)
}

module.exports = {
  Dispatcher,
}
