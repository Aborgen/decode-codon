const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'app.out.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 8080,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    })
  ]
};
