import path from 'path'
import { fileURLToPath } from 'url'
import vuePlugin from 'rollup-plugin-vue'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import pascalcase from 'pascalcase'
import json from '@rollup/plugin-json'
import { readFileSync } from 'fs'
import { terser } from 'rollup-plugin-terser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

const name = pkg.name

const getAuthors = (pkg) => {
    const { contributors, author } = pkg

    const authors = new Set()
    if (contributors && contributors) {
        contributors.forEach((contributor) => {
            authors.add(contributor.name)
        })
    }
    if (author) authors.add(author.name)

    return Array.from(authors).join(', ')
}

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${getAuthors(pkg)}
  * @license MIT
  */`

// ensure TS checks only once for each build
let hasTSChecked = false

const outputConfigs = {
    'esm-bundler': {
        file: pkg.module,
        format: 'es'
    },
    global: {
        file: pkg.unpkg,
        format: 'iife'
    },
    esm: {
        file: pkg.module.replace('bundler', 'browser'),
        format: 'es'
    }
}

const createReplacePlugin = (isProduction, isBundlerESMBuild) => {
    const replacements = {
        'process.env.NODE_ENV': isBundlerESMBuild
            ? 'process.env.NODE_ENV'
            : JSON.stringify(isProduction ? 'production' : 'development'),
        __VUE_PROD_DEVTOOLS__: isBundlerESMBuild
            ? '__VUE_PROD_DEVTOOLS__'
            : 'false'
    }
    Object.keys(replacements).forEach((key) => {
        if (key in process.env) {
            replacements[key] = process.env[key]
        }
    })
    return replace({
        preventAssignment: true,
        values: replacements
    })
}

const createMinifiedConfig = (format) => {
    return createConfig(
        format,
        {
            file: `dist/${name}.${format}.prod.js`,
            format: outputConfigs[format].format
        },
        [
            terser({
                module: /^esm/.test(format),
                compress: {
                    ecma: 2015,
                    pure_getters: true
                }
            })
        ]
    )
}

const createConfig = (format, output, plugins = []) => {
    if (!output) {
        console.log(`invalid format: "${format}"`)
        process.exit(1)
    }

    output.sourcemap = !!process.env.SOURCE_MAP
    output.banner = banner
    output.externalLiveBindings = false
    output.globals = { vue: 'Vue', '@vue/composition-api': 'vueCompositionApi' }

    const isProductionBuild = /\.prod\.js$/.test(output.file)
    const isGlobalBuild = format === 'global'
    const isBundlerESMBuild = /esm-bundler/.test(format)

    if (isGlobalBuild) output.name = pascalcase(pkg.name)

    const shouldEmitDeclarations = !hasTSChecked

    const tsPlugin = ts({
        check: !hasTSChecked,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
        tsconfigOverride: {
            compilerOptions: {
                sourceMap: output.sourcemap,
                declaration: shouldEmitDeclarations,
                declarationMap: shouldEmitDeclarations
            },
            exclude: ['__tests__', 'test-dts']
        }
    })
    // we only need to check TS and generate declarations once for each build.
    // it also seems to run into weird issues when checking multiple times
    // during a single build.
    hasTSChecked = true

    const external = ['vue', '@vue/composition-api']
    if (!isGlobalBuild) {
        external.push('@vue/devtools-api')
    }

    const nodePlugins = [resolve(), commonjs()]

    return {
        input: 'src/index.ts',
        external,
        plugins: [
            json(),
            vuePlugin(),
            tsPlugin,
            createReplacePlugin(
                isProductionBuild,
                isBundlerESMBuild
            ),
            ...nodePlugins,
            ...plugins
        ],
        output
    }
}

const allFormats = Object.keys(outputConfigs)
const packageFormats = allFormats
const packageConfigs = packageFormats.map((format) =>
    createConfig(format, outputConfigs[format])
)

// only add the production ready if we are bundling the options
packageFormats.forEach((format) => {
    if (format === 'global') {
        packageConfigs.push(createMinifiedConfig(format))
    }
})

export default packageConfigs