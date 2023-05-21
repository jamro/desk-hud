const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/frontend/index.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'src', 'backend', 'www'),
  },
  plugins: [new HtmlWebpackPlugin()],
};