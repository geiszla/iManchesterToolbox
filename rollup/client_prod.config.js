const options = require('./client_options');
const postReplace = require('rollup-plugin-replace');
const replace = require('rollup-plugin-post-replace');
const uglify = require('rollup-plugin-uglify');

export default (function setEvironment() {
  options.plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    postReplace({
      'const ': 'var '
    }),
    uglify()
  );

  return options;
}());
