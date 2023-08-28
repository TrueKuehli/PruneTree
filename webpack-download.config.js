const webpack = require('webpack')
const path = require('path')

// minifying for production
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// creates HTML page for application
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    assetFilter: function (assetFilename) {
      return !assetFilename.endsWith('vendors~main.js')
    }
  },
  // main entry
  entry: './src/Download.jsx',
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
              publicPath: './'
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
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: './',
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
      template: 'src/download.html',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: '[fullhash].[name].css',
      chunkFilename: '[fullhash].[id].css'
    })
  ]
}
