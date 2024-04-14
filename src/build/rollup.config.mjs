import { fileURLToPath } from 'url'

import alias from '@rollup/plugin-alias'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
const packageJsonVersion = 1

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs']
const banner = `/*!
* VueMoon v${packageJsonVersion}
* Forged by Jahan
* Released under the MIT License.
*/\n`

export default {
  input: 'src/index.ts',
  external: ['vue', 'vue-router'],
  output: [
    {
      dir: 'dist',
      entryFileNames: 'src/VueMoon.esm.js',
      format: 'es',
      sourcemap: true,
      banner,
    },
    {
      dir: 'dist',
      entryFileNames: 'src/VueMoon.js',
      name: 'VueMoon',
      format: 'umd',
      globals: { vue: 'Vue' },
      sourcemap: true,
      banner,
    },
    {
      dir: 'dist',
      entryFileNames: 'src/VueMoon.min.js',
      name: 'VueMoon',
      format: 'umd',
      globals: { vue: 'Vue' },
      plugins: [
        terser({
          format: { comments: /^!/, ecma: 2015, semicolons: false },
        }),
      ],
      sourcemap: true,
      banner,
    },
  ],
  plugins: [
    nodeResolve({ extensions }),
    alias({
      entries: [
        {
          find: /^@\/(.*)/,
          replacement: fileURLToPath(new URL('../src/$1', import.meta.url)),
        },
      ],
    }),
  ],
}
