const webpack = require('webpack')
const path = require('path')

const isProduction = process.env.NODE_ENV === 'production';

const PACKAGE = require('./package.json');
const CHANGELOG = require('fs').readFileSync('./CHANGELOG.md').toString();

// Minifying for production
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');

// Creates HTML page for application
const HtmlWebpackPlugin = require('html-webpack-plugin')
// Allows us to add git hash into source to display a version
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
// Adds favicon for us
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
// Adds a service worker for us, allowing offline usage
const {GenerateSW} = require('workbox-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin()


module.exports = {
  // Clean up output to be less noisy
  stats: {
    assets: true,
    children: false
  },
  // Asset size warnings on build
  performance: {
    // Max = 300 KiB
    maxAssetSize: 307200,
    // Max = 1.5 MiB
    maxEntrypointSize: 1573500,
    // We ignore the vendors bundle (node_modules) though should keep an eye on this from time to time as it's pretty
    //   big too. We also ignore the apple-touch-startup-images as these are very high-resolution images used for
    //   the PWA splash screen.
    assetFilter: function (assetFilename) {
      return !assetFilename.endsWith('vendors~main.js') &&
        !assetFilename.includes('apple-touch-startup-image-');
    }
  },
  // main entry
  entry: './src/AppRoot.tsx',
  mode: process.env.NODE_ENV,
  // devtool: 'hidden-source-map',
  // webpack loaders
  module: {
    rules: [
      // https://github.com/webpack/webpack/issues/11467
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /core-js/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            configFile: path.resolve(__dirname, 'babel.config.js'),
            compact: false,
            cacheDirectory: true,
            sourceMaps: false
          }
        }
      },
      // SCSS not loaded by components don't use CSS modules
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /styles\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      // SCSS loaded by components do use CSS modules
      {
        test: /styles\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // The relative path of the file where the current CSS is located relative to the packed root path dist
              publicPath: '/'
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:8]',
                exportLocalsConvention: 'camelCaseOnly',
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(ttf|eot|png|jpe?g|gif|webp|mp4|svg|woff?2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash:8][ext]'
        }
      },
      {
        test: /\.md$/,
        type: 'asset/source'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    // webpack 5 polyfilling (https://github.com/webpack/changelog-v5#automatic-nodejs-polyfills-removed)
    fallback: {}
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: '[fullhash:8].[name].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[fullhash:8].[name].css',
      chunkFilename: '[fullhash:8].[id].css'
    }),
    new webpack.DefinePlugin({
      COMMIT_HASH: JSON.stringify(gitRevisionPlugin.commithash()),
      PACKAGE_VERSION: JSON.stringify(PACKAGE.version),
      GIT_REPO_URL: JSON.stringify(PACKAGE.repository.url),
      BUILD_DATE: JSON.stringify(new Date().toISOString()),
      CHANGELOG: JSON.stringify(CHANGELOG),
    }),
    new FaviconsWebpackPlugin({
      logo: './src/common/images/favicon.png',
      logoMaskable: './src/common/images/favicon_maskable.png',
      prefix: 'icons-[fullhash:8]/',
      mode: 'webapp',
      devMode: 'webapp',
      favicons: {
        appName: 'The Prune Tree App',
        appShortName: 'Prune Tree',
        appDescription: 'Create dynamic family trees for your Sims legacies',
        developerName: PACKAGE.author,
        developerURL: 'https://github.com/TrueKuehli/PruneTree',
        start_url: '/',
        theme_color: '#6f1e51',
        background: '#ffffff',
      }
    }),
    isProduction &&
      new GenerateSW({
        dontCacheBustURLsMatching: /[0-9a-f]{8}\./,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/index.html',
      }),
  ],
  devServer: {
    historyApiFallback: true
  }
}
