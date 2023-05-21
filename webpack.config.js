const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
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
    path: path.resolve(__dirname, 'src', 'backend', 'www', 'js'),
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
    })
  ],
};