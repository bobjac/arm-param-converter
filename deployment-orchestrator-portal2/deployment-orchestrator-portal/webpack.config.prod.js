const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
var path = require('path');

module.exports = merge(common, {
  mode: 'production',
    // Affecting the output of the compilation
    output: {
      // path: the output directory as an absolute path (required)
      path: path.resolve(__dirname, '../deployment-orchestrator/client'),
      // filename: specifies the name of entry output file (required)
      filename: '[name].[chunkhash:10].js',
      // chunkFilename: specifies the name of non-entry output files (e.g. dynamic import component)
      chunkFilename: '[name].[chunkhash:10].js',
      // publicPath: specifies the server-relative URL of the output resource directory
      // https://webpack.js.org/configuration/output/#output-publicpath
      publicPath: '/',
    },
});