// https://benchmarkjs.com/docs
/* eslint-disable no-unused-expressions */
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()

// add tests
suite
  .add('RegExp#test', function () {
    ;/o/.test('Hello World!')
  })
  .add('String#indexOf', function () {
    'Hello World!'.indexOf('o') > -1
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  // run async
  .run({ async: true })
