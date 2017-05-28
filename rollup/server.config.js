const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');

const ignoredWarnings = ['MISSING_GLOBAL_NAME', 'MISSING_NODE_BUILTINS', 'UNRESOLVED_IMPORT'];

export default {
  entry: 'server/server.jsx',
  plugins: [
    babel({
      exclude: 'scripts/build_options.js'
    }),
    commonjs()
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
