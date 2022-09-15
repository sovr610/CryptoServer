const path = require("path");
const fs = require("fs");
const solc = require("solc");

const file = path.resolve(__dirname, "contracts","hello.sol");
const source = fs.readFileSync(file, "UTF-8");

module.exports = solc.compile(source, 1).contracts[':contractName'];