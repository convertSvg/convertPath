import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: './lib/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    strict: true
  },
  plugins: [
    commonjs(),
    resolve(),
    buble()
  ],
  external: ['path', 'fs']
}
