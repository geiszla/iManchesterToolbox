const replace = require('rollup-plugin-replace');
const options = require('./client_options');

export default (function setEvironment() {
  options.plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '# sourceMappingURL': ' '
    })
  );
  // options.sourceMap = false;

  return options;
}());
