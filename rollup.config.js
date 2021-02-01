import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import alias from 'rollup-plugin-alias'

// postcss plugins
import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/renderer.js',
  output: {
    sourcemap: true,
    format: 'umd',
    name: 'app',
    file: 'public/assets/bundle.js'
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production
      },

      emitCss: true
    }),

    postcss({
      plugins: [
        postcssImport(),
        postcssPresetEnv({
          stage: 4,
          browsers: 'last 5 Chrome versions'
        })
      ],
      extract: true,
      extensions: ['.css']
    }),

    // define alias
    alias({
      resolve: ['', '.js', '.svelte'],
      entries: [
        { find: '~', replacement: './' },
        { find: '@', replacement: 'src' },
        { find: '@components', replacement: 'src/components' },
        { find: '@views', replacement: 'src/views' }
      ]
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
    }),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
}
