import { blue, white } from 'material-ui/colors';

import createMuiTheme from 'material-ui/styles/theme';
import createPalette from 'material-ui/styles/palette';

export default (function createTheme() {
  return createMuiTheme({
    palette: createPalette({
      primary: blue,
      accent: white
    })
  });
}());
