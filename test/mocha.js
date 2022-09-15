var expect = require("chai").expect;
var request = require("request");

const url = "http://localhost:3000";

it("getting list of exchanges", function (done) {
  request(url, function (error, response, body) {
    expect(body).to.equal("Hello World");
    done();
  });
});
