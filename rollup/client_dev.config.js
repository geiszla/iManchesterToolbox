const options = require('./client_options');
const replace = require('rollup-plugin-replace');

export default (function setEvironment() {
  options.plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      API_URL: 'https://localhost/api',
      '# sourceMappingURL=': ''
    })
  );

  return options;
}());
