/* eslint-disable @typescript-eslint/no-var-requires */
// const webpack = require(`webpack`)
const { join } = require(`path`)
const TerserPlugin = require(`terser-webpack-plugin`)
const workspace = join(__dirname)
const workspaceModules = join(workspace, `node_modules`)

// const isProd = process.env.NODE_ENV === `production`
// const isLocal = process.env.LOCAL === `1` ? true : false

module.exports = {
  jest: {
    configure: (jestConfig) => {
      return {
        ...jestConfig,
        moduleNameMapper: { ...jestConfig.moduleNameMapper, "^acp/(.*)(ts|tsx|js|jsx|)$": `<rootDir>/$1` },
      }
    },
  },
  webpack: {
    configure(webpackConfig) {
      webpackConfig.optimization.minimizer[0] = new TerserPlugin({
        extractComments: false,
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
            pure_funcs: [
              // "console.info",
              `console.debug`,
              `console.warn`,
              `console.log`,
            ],
            // drop_console: true,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      })
      /**
       * Modify Webpack configuration based on BugSnag docs
       * We require in the conditional statement to minimize the footprint in the development
       *   - @see https://docs.bugsnag.com/build-integrations/webpack
       */
      // if (isProd && !isLocal) {
      //   const {
      //     BugsnagSourceMapUploaderPlugin,
      //   } = require(`webpack-bugsnag-plugins`)
      //   const { version: appVersion } = require(`./package.json`)

      //   webpackConfig.devtool = `source-map`
      //   webpackConfig.plugins.push(
      //     new BugsnagSourceMapUploaderPlugin({
      //       apiKey: process.env.REACT_APP_BUGSNAG_APIKEY,
      //       appVersion,
      //       overwrite: true,
      //     }),
      //   )
      // }

      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        extensions: [`.ts`, `.tsx`, `.js`, `.jsx`],
        modules: [workspaceModules],
        alias: {
          acp: workspace,
        },
      }

      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: `javascript/auto`,
      })
      /**
       * Remove ModuleScopePlugin from CRA to allow imports outside of "src"
       */
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        ({ constructor = {} }) => constructor.name !== `ModuleScopePlugin`,
      )
      // /**
      //  * Replace "process.env" variables with literals, so webpack optimization plugin could remove dead code
      //  */
      // webpackConfig.plugins.push(
      //   new webpack.EnvironmentPlugin({
      //     CI: !!process.env.CI,
      //     /**
      //      * @todo other env variables that we use
      //      */
      //   }),
      // )

      return webpackConfig
    },
  },
}
