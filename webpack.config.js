const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = env => ({
  entry: './src/frontend/index.js',
  mode: 'production',
  module: {
    rules: [{
      test: /\.(js)$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  output: {
    filename: 'app.js',
    path: (env.demo === true || env.demo === 'true') ? path.resolve(__dirname, 'dist', 'demo', 'js') : path.resolve(__dirname, 'src', 'backend', 'www', 'js'),
    clean: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "build/assets", to: "../assets" },
        { from: "build/js", to: "./" },
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'build/index.html',
      filename: '../index.html'
    }),
    new webpack.DefinePlugin({
      BUILD_DEMO_MODE: env.demo || false
    })
  ],
});