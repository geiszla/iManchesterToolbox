import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';

import App from '../src/components/app.jsx';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import fs from 'fs';
import getMarks from './arcade.js';
import graphQLSchema from './graphql';
import graphqlHTTP from 'express-graphql';
import http from 'http';
import https from 'https';
// import mongoose from 'mongoose';
import path from 'path';
// import prompt from 'prompt';
import { renderToString } from 'react-dom/server';
import session from 'express-session';

// HTTP Webserver
const unsecureApp = express();

unsecureApp.get('*', (req, res) => {
  res.redirect(`https://localhost${req.originalUrl}`);
});

http.createServer(unsecureApp).listen(8080);

//  HTTPS Webserver
const app = express();
app.use(compression());

app.use(favicon(path.join(__dirname, 'www', 'images', 'favicon.jpg')));
app.use(express.static(path.join(__dirname, 'www'), { index: false }));
app.use(cookieParser());
app.use(session({
  secret: '98414c22d7e2cf27b3317ca7e19df38e9eb221bd',
  resave: true,
  saveUninitialized: false
}));

app.use('/api',
  graphqlHTTP(req => ({
    schema: graphQLSchema,
    rootValue: { session: req.session },
    graphiql: true
  })),
);

app.get('*', (req, res) => {
  // const isLoggedIn = req.session.isLoggedIn === true;

  const client = new ApolloClient({
    ssrMode: true,
    networkInterface: createNetworkInterface({
      uri: 'https://localhost/api',
      opts: {
        credentials: 'same-origin',
        headers: req.headers,
      },
    }),
  });

  const context = {};
  const appHtml = renderToString(
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  );

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    });
    res.send();
  } else {
    res.send(renderPage(appHtml));
  }
});

function renderPage(appHtml) {
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
    </head>
    <body>
      <div id="root">${appHtml}</div>
    </body>
    </html>
   `;
}

const options = {
  key: fs.readFileSync(path.join(__dirname, 'server/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'server/cert.crt')),
  passphrase: 'iManT'
};
https.createServer(options, app).listen(443);
console.log('Server is running on port 8080.');

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
