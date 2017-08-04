const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const globals = require('rollup-plugin-node-globals');
const json = require('rollup-plugin-json');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
  entry: 'src/index.jsx',
  targets: [{
    dest: 'www/bundle.js',
    format: 'umd'
  }],
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs({
      namedExports: {
        'graphql-anywhere': ['PropType'],
        'material-ui/Card': ['CardActions', 'CardContent'],
        'material-ui/colors': ['grey', 'red', 'blue', 'white'],
        'material-ui/Form': ['FormControlLabel'],
        'material-ui/List': ['ListItem', 'ListItemText'],
        'material-ui/Menu': ['MenuItem'],
        'material-ui/styles': [
          'MuiThemeProvider', 'createMuiTheme', 'createStyleSheet', 'withStyles'
        ],
        'material-ui/Tabs': ['Tab'],
        'mobx-react': ['observer'],
        'react-dom': ['render'],
        'node_modules/react-apollo/react-apollo.browser.umd.js': [
          'ApolloProvider', 'ApolloClient', 'compose', 'graphql', 'gql'
        ]
      },
      sourceMap: false,
      ignoreGlobal: true
    }),
    globals(),
    json(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  onwarn: (warning) => {
    if (warning.code !== 'THIS_IS_UNDEFINED' && warning.loc
      && warning.loc.file.indexOf('fetch.js') === -1
      && warning.loc.file.indexOf('es6.object.to-string.js') === -1
      && warning.loc.file.indexOf('redux\\es\\index.js') === -1) {
      console.log(`Warning: ${warning}`);
    }
  }
};
