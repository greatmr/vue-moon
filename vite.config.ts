import path from 'path'
import fs, { readFileSync } from 'fs'
import { fileURLToPath } from 'node:url'

import fg from 'fast-glob'
import rollupOptions from './src/build/rollup.config.mjs'

import { loadEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = (file: any) => path.resolve(__dirname, file)

const index = readFileSync(resolve('src/components/index.ts'), {
  encoding: 'utf8',
})
const block = Array.from(
  index.matchAll(/^\/\/ export \* from '\.\/(.*)'$/gm),
  (m) => m[1]
)
const files = fg.sync(['src/components/**/index.ts', 'src/labs/**/index.ts'], {
  cwd: __dirname,
})
const components = files.filter(
  (file) =>
    file.startsWith('src/labs') ||
    !block.some((name) => file.includes(`/${name}/`))
)
const map = new Map(
  components.flatMap((file: string) => {
    const src = readFileSync(file, { encoding: 'utf8' })
    const matches = src.matchAll(/export const (V\w+)|export { (V\w+) }/gm)
    return Array.from(matches, (m) => [
      m[1] || m[2],
      file.replace('src/', '@/').replace('.ts', ''),
    ])
  })
)

const VueMoonPackage = fs.readFileSync('./package.json', 'utf-8') as any

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    server: {
      host: process.env.HOST,
      port: process.env.CYPRESS ? undefined : +(process.env.PORT ?? 8090),
      strictPort: !!process.env.PORT && !process.env.CYPRESS,
    },
    preview: {
      host: process.env.HOST,
      port: +(process.env.PORT ?? 8090),
      strictPort: !!process.env.PORT,
    },
    plugins: [
      vue(),
      vueJsx({ optimize: false, enableObjectSlots: false }),
      Components({
        dts: !process.env.CYPRESS,
        resolvers: [
          (name: string) => {
            if (map.has(name)) {
              return { name, from: map.get(name) || '' }
            }
          },
        ],
      }),
      VueDevTools(),
    ],
    build: {
      lib: {
        formats: ['es'],
        entry: resolve('./src/index.ts'),
        name: 'VueMoon',
        fileName: '[name]',
      },
      rollupOptions,
      minify: false,
    },
    define: {
      __VUEMOON_VERSION__: JSON.stringify(VueMoonPackage.version),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
