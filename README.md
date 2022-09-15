# Crypto node exchange server

## Description
This node project is a restful API server that connects to over 200 crypto exchanges using ccxt library. You can build a front-end
or a desktop application to connect to this server to set orders, get orderbooks, ticker price, create withdrawals, historical data, etc. The endpoints are located in `./src/server.js` and this is where most of the heavy lifting is done in the server. Gulp
is used to concat and minify the Javascript files, json files and other optimizations. 

## setup

1. Make sure you have node js installed on your computer. The link for node js is: (node download)[https://nodejs.org/en/download/current/]

2. run command: `npm install --global --production windows-build-tools`

3. run command: `npm install -g node-gyp --unsafe-perm=true --allow-root`, if already installed run: run command: `npm upgrade -g node-gyp --unsafe-perm=true --allow-root`

4. run command: `npm install -g scrypt web3 node-gyp --unsafe-perm=true --allow-root`

5. in the root directory of the project crypto node server perform `npm install`.

6. in the ccxt folder perform the same command `npm install`

7. once everything is installed you can start up the server with command `node server.js` in the root directory of the crypto node server project.

## Linting

- to lint the project just run `npm install -g eslint` and then in the root directory of the crypto node project run `eslint <filename>.js --fix`.

## Building

- to build the project make sure you run this command:

  - `npm install -g mocha chai gulp gulp-cli prettier`

- to build the project run command: `npm run build`

- to build and run the server, run command: `npm run run`