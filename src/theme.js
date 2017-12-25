import { blue, white } from 'material-ui/colors';

import { createMuiTheme } from 'material-ui/styles';

export default (function createTheme() {
  return createMuiTheme({
    palette: {
      primary: blue,
      accent: white
    }
  });
}());
