const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
  entry: 'src/index.jsx',
  targets: [{
    dest: 'www/bundle.js',
    format: 'umd'
  }],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      namedExports: {
        'material-ui/Card': ['CardActions', 'CardContent'],
        'material-ui/styles': ['MuiThemeProvider', 'createMuiTheme', 'createStyleSheet', 'withStyles'],
        'material-ui/Tabs': ['Tab'],
        'mobx-react': ['observer'],
        'react-dom': ['render'],
        'react-apollo': ['ApolloProvider', 'ApolloClient', 'compose', 'graphql', 'gql']
      },
      sourceMap: false
    })
  ],
  onwarn: (warning) => {
    if (warning.code !== 'THIS_IS_UNDEFINED' && warning.loc
      && warning.loc.file.indexOf('es6.object.to-string.js') === -1
      && warning.loc.file.indexOf('redux\\es\\index.js') === -1) {
      console.log(`Warning: ${warning}`);
    }
  }
};
