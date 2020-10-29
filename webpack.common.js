const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'app.out.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      data: path.resolve(__dirname, 'src/data'),
      types: path.resolve(__dirname, 'src/types'),
      tests: path.resolve(__dirname, 'tests')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/static/favicon') }
      ]
    })
  ]
};
