const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
      util: require.resolve('util'),
      assert: require.resolve('assert'),
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [
    // If needed, polyfill process.env
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
  // Your other Webpack configurations go here
};
