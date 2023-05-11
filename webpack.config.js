const webpack = require('webpack')
const path = require('path')

// minifying for production
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// creates HTML page for application
const HtmlWebpackPlugin = require('html-webpack-plugin')
// allows us to add git hash into source to display a version
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
// adds favicon for us
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  // clean up output to be less noisy
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
    // We use GIFs in the guides as mini "videos" of how to do stuff and these
    // can end up larger than our other assets so we ignore them in performance
    // output as their larger size is expected.
    //
    // We also ignore the vendors bundle (node_modules) though should keep an
    // eye on this from time to time as its pretty big too.
    assetFilter: function (assetFilename) {
      return !assetFilename.endsWith('.gif') && !assetFilename.endsWith('vendors~main.js')
    }
  },
  // main entry
  // todo - may be able to code split to be more efficient?
  entry: './src/AppRoot.jsx',
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
        test: /\.(js|jsx)$/,
        exclude: /core-js/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
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
              publicPath: process.env.NODE_ENV === 'production' ? '/assets/' : '/'
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:8]'
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(ttf|eot|png|jpe?g|gif|svg|woff?2)$/i,
        type: 'asset'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    // webpack 5 polyfilling (https://github.com/webpack/changelog-v5#automatic-nodejs-polyfills-removed)
    fallback: {
      util: require.resolve('util/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify')
    }
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: process.env.NODE_ENV === 'production' ? '/assets/' : '/',
    filename: '[fullhash].[name].js'
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
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
      hash: true
    }),
    new HtmlWebpackPlugin({
      template: 'src/public.html',
      filename: 'public.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[fullhash].[name].css',
      chunkFilename: '[fullhash].[id].css'
    }),
    new webpack.DefinePlugin({
      COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
      STACK: JSON.stringify(process.env.STACK)
    }),
    new FaviconsWebpackPlugin({
      logo: './src/common/images/favicon.png',
      prefix: 'icons-[fullhash]/',
      mode: 'auto'
    })
  ],
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  }
}
