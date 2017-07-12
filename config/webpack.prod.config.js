const config = require('./webpack.dev.config');
const webpack = require('webpack');
const merge = require('webpack-merge');

// 压缩版
const minConfig = merge(config, {
  output: {
    filename: 'index.js',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
});

module.exports = minConfig;
