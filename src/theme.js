import { blue, pink, white } from 'material-ui/styles/colors';

import createMuiTheme from 'material-ui/styles/theme';
import createPalette from 'material-ui/styles/palette';

export default (function createTheme() {
  return createMuiTheme({
    palette: createPalette({
      primary: blue,
      accent: {
        ...pink,
        A200: white
      }
    })
  });
}());
