const options = require('./client_options');
const replace = require('rollup-plugin-replace');

export default (function setEvironment() {
  options.plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '# sourceMappingURL': ' '
    })
  );

  return options;
}());
