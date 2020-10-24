const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,
        sourceMap: true,
        minimizerOptions: {
          preset: [
            'default', { discardComments: { removeAll: true } }
          ]
        }
      }),
      new TerserPlugin({
        terserOptions: {
          parallel: true,
          output: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  }
});
