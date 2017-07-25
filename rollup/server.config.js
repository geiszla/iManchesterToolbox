const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');

const ignoredWarnings = ['MISSING_GLOBAL_NAME', 'MISSING_NODE_BUILTINS', 'UNRESOLVED_IMPORT'];

export default {
  entry: 'server/server.jsx',
  plugins: [
    commonjs({
      sourceMap: false
    }),
    babel()
  ],
  targets: [{
    dest: 'server.bundle.js',
    format: 'umd'
  }],
  onwarn: (warning) => {
    if (!ignoredWarnings.includes(warning.code)) {
      console.log(`Warning: ${warning}`);
    }
  }
};
