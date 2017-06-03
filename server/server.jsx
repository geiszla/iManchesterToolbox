import { ApolloProvider, renderToStringWithData } from 'react-apollo';

import App from '../src/components/App.jsx';
import { MuiThemeProvider } from 'material-ui/styles';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import apolloClient from '../src/apollo_client.js';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import fetch from 'node-fetch';
import fs from 'fs';
import getMarks from './arcade.js';
import graphQLSchema from './graphql';
import graphqlHTTP from 'express-graphql';
import http from 'http';
import https from 'https';
import muiTheme from '../src/theme.js';
import path from 'path';
import session from 'express-session';

const morgan = require('morgan');

// HTTP Webserver
const unsecureApp = express();

unsecureApp.get('*', (req, res) => {
  res.redirect(`https://localhost${req.originalUrl}`);
});

http.createServer(unsecureApp).listen(8080);

//  HTTPS Webserver
const app = express();
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(compression());

app.use(favicon(path.join(__dirname, 'www', 'images', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'www'), { index: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: '98414c22d7e2cf27b3317ca7e19df38e9eb221bd',
  resave: true,
  saveUninitialized: false
}));

app.use('/api',
  (req, res, next) => {
    console.log(`GraphQL API request: ${req.body.operationName}`);
    next();
  },
  graphqlHTTP(req => ({
    schema: graphQLSchema,
    rootValue: { session: req.session },
    graphiql: true
  })),
);

app.get('*', (req, res) => {
  console.log();
  const headers = Object.assign({}, req.headers, {
    accept: 'application/json'
  });
  const client = apolloClient(true, headers);

  const { styleManager, theme } = MuiThemeProvider.createDefaultContext({ theme: muiTheme });

  const context = {};
  const reactApp = (
    <MuiThemeProvider styleManager={styleManager} theme={theme}>
      <ApolloProvider client={client}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </ApolloProvider>
    </MuiThemeProvider>
  );

  renderPage(reactApp, client, styleManager).then((html) => {
    if (context.url) {
      res.writeHead(301, {
        Location: context.url
      });
      res.send();
    } else {
      res.send(html);
    }
  }).catch((err) => { console.log(err); });
});

global.fetch = fetch;

function renderPage(reactApp, client, styleManager) {
  return renderToStringWithData(reactApp).then((content) => {
    const initialState = { apollo: client.getInitialState() };
    const css = styleManager.sheetsToString();

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>iManchester Toolbox</title>

          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet">
          <link rel="stylesheet" type="text/css" href="styles.css">

          <script src="bundle.js"></script>
          <script>window.__APOLLO_STATE__ = ${JSON.stringify(initialState)};</script>
        </head>
        <body>
          <div id="root">${content}</div>
          <style id="jss-server-side">${css}</style>
        </body>
      </html>
    `;
  });
}

const options = {
  key: fs.readFileSync(path.join(__dirname, 'server/ssl/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'server/ssl/cert.crt')),
  passphrase: 'iManT'
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
https.createServer(options, app).listen(443);
console.log('Server is started.');

// getMarks();
// prompt.start();
// prompt.get('password', (err, result) => {
//   if (err) return;
//   else {
//     getMarks("mbaxaag2", result.password);
//   }
// });

// MongoDB
// const mongooseOptions = {
//   server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
//   replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
// };

// mongoose.connect('mongodb://boxhero:BoxHeroY4@ds011374.mlab.com:11374/boxhero', mongooseOptions, () => {
//   console.log('Connected to MongoDB server.');
// });
