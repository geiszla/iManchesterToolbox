const options = require('./client_options');
const replace = require('rollup-plugin-replace');
const uglify = require('rollup-plugin-uglify');

export default (function setEvironment() {
  options.plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      API_URL: 'https://imant.herokuapp.com/api'
    }),
    uglify()
  );

  return options;
}());
