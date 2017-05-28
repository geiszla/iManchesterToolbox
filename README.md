# iManchester Toolkit
A web application based on the React framework developed for The University of Manchester students.

**Table of contents**
* [Setting up](#setting-up)
* [Development](#development)
* [Project Structure](#project-structure)

## Setting up
### Set up project
1. Download or clone project source.
2. Unzip files to any directory.
3. Install latest version of Node.js with default settings (https://nodejs.org/en/download/current/). On Linux, you may need to add the node/bin folder to the path manually.
4. Install latest Yarn Package Manager release with default settings (https://yarnpkg.com/lang/en/docs/install/).
5. Navigate to unzipped project files using a command line utility.
6. Enter `yarn install` to install all dependencies of the project.

### For production
If you install the server for production use (i.e. you don't want to edit the webapp) open a new terminal, navigate to the project files and enter `yarn run production`. Then jump to "[Visit website](#visit-the-website)" section.

### Set up development environment
#### Install LivePage Chrome extension (optional)
LivePage automatically reloads the page when the application is updated.

1. Download source code of latest release of LivePage (https://github.com/MikeRogers0/LivePage/releases).
2. Unzip files to any folder.
3. Open Chrome extensions page (chrome://extensions/).
4. Tick the box next to "Developer mode" option on the top right corner of the page.
5. Click "Load unpacked extension..." button.
6. Select the unzipped LivePage folder.
7. To use it select the tab containing the application and click on the LivePage icon on the Chrome extension bar.

#### Install Visual Studio Code (optional)
Visual Studio Code is a text editor that provides useful tools for easy JavaScript and React development.

1. Download Visual Studio Code and install it with default settings (https://code.visualstudio.com/).
2. Open project folder inside Visual Studio Code by clicking File > "Open Folder..." or by right clicking on the folder in Windows Explorer and clicking "Open with Code".
3. If terminal is not open in the bottom of the text editor pane, open it by selecting View > "Integrated Terminal" menu option.
4. Install "ESLint" by selecting View > Extensions and typing it into the search field.
5. Optionally set up a key shortcut for linting. Select File > Preferences > "Keyboard Shortcuts" and copy the following into the right window pane (user settings) replacing the key with the chosen one.

```json
[
{ "key": "ctrl+e d",              "command": "eslint.executeAutofix" }
]
```

#### Install React Developer Tools Chrome Extension (optional)
Adds React debugging tools to the Chrome Developer Tools.

1. Install React Developer Tools Chrome Extension from the [Chrome Extensions website](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).
2. To use it open Chrome Developer Tools (while the tab with the developed website is selected) by pressing the "F12" key or by right clicking the page followed by "Inspect" option.
3. In Chrome Developer Tools select "React" tab.

## Development
### Without Visual Studio Code
#### Start server
1. Navigate to the project files using a command line utility.
2. Enter `npm install -g rollup nodemon` to install these node utilities globally.
3. Enter `yarn start` to start the server.

#### Start editing
1. Navigate to the project files using a command line utility.
2. Enter `yarn run edit` to start monitoring the changes in code and automatically bundle the application.
3. Before every git push, run ESLint to fix syntactic and semantic errors in JavaScript files (may have to run the command multiple times to fix all issues).
4. Optionally turn on LivePage extension by clicking on its icon in the chrome extenstion bar (see install instructions above).

### With Visual Studio Code
See setup instructions [above](#install-visual-studio-code-optional).

#### Start server
1. Open project folder inside Visual Studio Code by clicking File > "Open Folder..." or by right clicking on the folder in Windows Explorer and clicking "Open with Code".
2. If terminal is not open in the bottom of the text editor pane open it by selecting View > "Integrated Terminal" menu option.
3. Enter `npm install -g rollup nodemon` to install these node utilities globally.
4. In the terminal enter `yarn start` to start the server.

#### Start editing
1. In Visual Studio Code click on the "+" icon in the terminal pane to open a new terminal.
2. Enter `yarn run edit` to start monitoring the changes in code and automatically bundle the application.
3. Before every git push use the previously set up key shortcut to lint the current file and fix syntactic and semantic errors in JavaScript files (may have to run the command multiple times to fix all issues).
4. Fix other issues, which couldn't be automatically solved, reported by the previous command.
5. Repeat linting with all modified files.
6. Optionally turn on LivePage extension by clicking on its icon in the chrome extenstion bar (see install instructions above).

### Visit the website
Open a web browser and navigate to "[https://localhost/](https://localhost/)" to access the webapp.

## Project Structure
* node_modules

   Node.js modules used by our project. They are listed in package.json under "dependencies" and "devDependencies" sections and are automatically fetched by the `yarn install` command (they shouldn't be modified manually).

* rollup

   Rollup configuration files for making bundle.js (client)  and server.bundle.js (server).

  * client_dev.config.js and client_prod.config.js

     Configuration options for generating "www/bundle.js" - by translating and packing the react elements together. If `yarn run edit` command is used it runs every time the code changes updating the bundle.

  * client_options.js

     Options for bundling client for development and production.

  * server.config.js

     Configuration options for generating server.bundle.js from server.js (to convert ES6 and JSX code in server.js to plain JavaScript so that it can be run by Node.js).

* server

   Code of the backend. They are packed together into server.bundle.js.

   * arcade.js

     Code for requesting data from Arcade through SSH and parsing it into a JavaScript object.

  * graphql.js

     All the GraphQL types and schemas are defined here. They hold information on how to respond to requests from the GraphQL frontend.

  * mongoose.js

     Mongoose schemas and models are defined here. They specify how data in the MongoDB database looks like and how to get/insert/update data when a GraphQL query is serviced.

  * server.jsx

     JavaScript code that describes the working of the webserver and sends the generated index.html and bundle.js files to the client on request.

  * cert.crt, key.pem, openssl.cnf

     Files required for HTTPS server. They are NOT bundled to server.bundle.js

* src

   Source files of the frontend mainly consisting of React JSX code.

  * components

     Each React component is defined here. The "routes.jsx" file contains the routing information of the pages (the structure of the website).

  * styles

     Contains the styles of the website (written in stylus). It's compiled to CSS code during client compilation (see rollup configs).

  * graphql.js

     Handles the request and response to/from the GraphQL backend (e.g. to fetch data from the database).

  * index.jsx

     Renders the React document starting with the entry "BrowserRouter" object (which handles the navigation between pages).

* www

   Files that will be sent to the client the first time it visits the webapp. They are generated from the source files in the "src" folder by Rollup.

  * bundle.js

     JavaScript code that generates each page and element of the webapp dynamically when the user navigates on it.

  * styles.css

    Styles for the application compiled from the stylus files in "src/styles".

* .babelrc

   Configuration file for the babel node module which translates JSX code to JavaScript.

* .eslintrc

  Configuration file for the linter. It specifies the coding standard and the rules of it.

* jsconfig.json

   Contains JavaScript language service configuration options (used by e.g. Visual Studio Code).

* package.json

   Contains the properties and dependencies of the project.

* server.bundle.js

   The generated server file. Runs first when the server is started (by `yarn start` command).

* upgrade.js

   Script for upgrading all dependencies and devDependencies of the project to the latest versions.

* yarn.lock

   File generated by Yarn Package Manager describing modules and their dependencies. Shouldn't be modified manually.
