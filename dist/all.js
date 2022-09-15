const ccxt = require("ccxt");
const fs = require("fs");
pino_express = require("express-pino-logger");
pino = require("pino");
var inquirer = require("inquirer");
const cluster = require("cluster");
var path = require("path");
const express = require("express");
const app = express();
var rp = require("request-promise");
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");
var compression = require("compression");
const crypto = require("crypto");
var rp = require("request-promise");
var ajax = require("node.ajax");
const { parse, stringify } = require("flatted/cjs");
const options_swag = {
  explorer: true,
};

parkersFunction = {};

parkersFunction.getRequest = function (
  url_main,
  success_callback,
  failure_callback,
  method = "GET",
  headers = undefined,
  body = undefined
) {
  var options = {
    uri: url_main,
    /*qs: {
            access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
        },*/
    /*headers: {
            'User-Agent': 'Request-Promise'
        },*/
    json: true, // Automatically parses the JSON string in the response
  };

  try {
    rp(options)
      .then(function (json) {
        //loggerPino.info(json);
        success_callback(json);
      })
      .catch(function (err) {
        loggerPino.error(err);
        failure_callback(err);
      });
  } catch (e) {
    loggerPino.error(e);
    failure_callback(e);
  }
};

parkersFunction.getRequestWithSignature = function (
  url_base,
  queryString,
  success_callback,
  failure_callback,
  api_key,
  method = "GET",
  headers = undefined,
  body = undefined,
  secret = undefined
) {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(queryString)
    .digest("hex");

  var options = {
    uri: url_base + "?" + queryString + "&signature=" + hash,
    /*qs: {
            access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
        },*/
    headers: {
      "X-MBX-APIKEY": api_key,
    },
    json: true, // Automatically parses the JSON string in the response
  };

  try {
    rp(options)
      .then(function (json) {
        //loggerPino.info(json);
        success_callback(json);
      })
      .catch(function (err) {
        //console.log('catch error');
        loggerPino.error(err);
        failure_callback(err);
      });
  } catch (e) {
    loggerPino.error(e);
    failure_callback(e);
  }
};

parkersFunction.getIsCoinPaymentID = function (result, error) {
  this.getRequest(
    "https://api.hitbtc.com/api/2/public/currency",
    function (res) {
      loggerPino.info(res);
      result(res);
    },
    function (err) {
      loggerPino.info(err);
      error(err);
    }
  );
};

parkersFunction.getWithdrawFeeAndActive = function (
  exchange,
  currency = null,
  withdrawOrDeposit = null,
  amount = null,
  api_key = null,
  api_secret = null
) {
  switch (exchange) {
    case "binance":
      var promiseObj = new Promise(function (result, error) {
        var timestamp = new Date().getTime();

        parkersFunction.getRequestWithSignature(
          "https://api.binance.com/wapi/v3/assetDetail.html",
          "timestamp=" + timestamp + "&recvWindow=5000",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          },
          api_key,
          "GET",
          null,
          null,
          api_secret
        );
      });
      return promiseObj;
    case "bittrex":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://www.bittrex.com/api/v1.1/public/getCurrencies",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "hitbtc":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://api.hitbtc.com/api/2/public/currency",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "anybits":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://www.anybits.com/api/public/assets/currencies",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "bitsane":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://bitsane.com/api/public/assets/currencies",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "bleutrade":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://www.bleutrade.com/api/v2/public/getcurrencies",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "buda":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://www.buda.com/api/v2/currencies/" +
            currency +
            "/fees/" +
            withdrawOrDeposit,
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "cobinhood":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://api.cobinhood.com/v1/market/currencies",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "crex24":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://api.crex24.com/CryptoExchangeService/BotPublic/ReturnCurrencies",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "kraken":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://api.kraken.com/0/private/WithdrawInfo?asset=" +
            currency +
            "&key=" +
            key +
            "&amount=" +
            amount,
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "livecoin":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://api.livecoin.net/info/coininfo",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "cryptopia":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://www.cryptopia.co.nz/api/GetCurrencies",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
    case "poloniex":
      var promiseObj = new Promise(function (result, error) {
        parkersFunction.getRequest(
          "https://poloniex.com/public?command=returnCurrencies",
          function (res) {
            result(res);
          },
          function (err) {
            error(err);
          }
        );
      });
      return promiseObj;
  }

  return promiseObj;
};

parkersFunction.parseData = function (exchange, info, currency) {
  switch (exchange) {
    case "bittrex":
      return parseBittrexFees(info, currency);
    case "hitbtc":
      return parseHitbtcFees(info, currency);
    case "anybits":
      return parseAnybitFees(info, currency);
    case "bitsane":
      return parseBitsaneFees(info, currency);
    case "bleutrade":
      return parseBleuTradeFees(info, currency);
    case "buda":
      return parseBudaFees(info, currency);
    case "cobinhood":
      return parseCobinhoodFees(info, currency);
    case "crex24":
      return parseCrex24Fees(info, currency);
    case "kraken":
      return null; //this.getRequest("https://api.kraken.com/0/private/WithdrawInfo?asset=" + currency + "&key=" + key + "&amount=" + amount)
    case "binance":
      return parseBinanceFees(info, currency);
    case "livecoin":
      return praseLiveCoinFees(info, currency);
    case "cryptopia":
      return parseCryptopiaFees(info, currency);
    case "poloniex":
      return parsePoloniexFees(info, currency);
  }

  function parsePoloniexFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: true,
      };

      var inf = info[currency];
      ret.withdraw_fee = inf.txFee;
      if (inf.disabled == true) {
        ret.isActive = false;
      } else {
        ret.isActive = true;
      }
      ret.symbol = currency;
      return ret;
    } catch (e) {
      loggerPino.error(e);
    }
  }

  function parseBinanceFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: true,
      };

      var tradeFees = info.assetDetail;
      var trueData = tradeFees[currency];

      ret.minWithdrawAmount = trueData.minWithdrawAmount;
      ret.deposit_frozen = trueData.depositStatus;
      ret.withdraw_fee = trueData.withdrawFee.toString();

      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }

  function parseCryptopiaFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: true,
      };
      //console.log(info);
      var currencies = info.Data;
      var filtered_cryptopia_arr = currencies.filter(function (x) {
        return x.Symbol == currency;
      });
      var filtered_cryptopia = filtered_cryptopia_arr[0];
      //console.log(filtered_cryptopia)
      ret.withdraw_fee = filtered_cryptopia.WithdrawFee;
      ret.withdraw_max = filtered_cryptopia.MaxWithdraw;
      ret.withdraw_min = filtered_cryptopia.MinWithdraw;
      if (filtered_cryptopia.Status != "OK") {
        ret.isActive = false;
      } else {
        ret.isActive = true;
      }
      ret.symbol = currency;

      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }

  function parseCobinhoodFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: true,
      };

      //console.log(JSON.stringify(info));

      var currencies = info.result.currencies;
      //console.log(currencies);
      var filtered_cobinhood_arr = currencies.filter(function (x) {
        return x.currency == currency;
      });

      var filtered_cobinhood = filtered_cobinhood_arr[0];
      ret.symbol = currency;
      ret.deposit_fee = filtered_cobinhood.deposit_fee;
      ret.withdraw_fee = filtered_cobinhood.withdrawal_fee;
      ret.withdraw_min = filtered_cobinhood.min_withdrawal;
      if (
        filtered_cobinhood.deposit_frozen ||
        filtered_cobinhood.withdrawal_frozen
      ) {
        ret.isActive = false;
      } else {
        ret.isActive = true;
      }

      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }

  function parseBudaFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: true,
      };

      var fees = info.fee;
      if (fees.name == "withdrawal") {
        ret.withdraw_fee = fees.base[0];
      } else {
        ret.deposit_fee = fees.base[0];
      }
      ret.symbol = currency;
      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }

  function parseBleuTradeFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: 0,
      };
      var results = info.result;
      var filtered_bleutrade_arr = results.filter(function (x) {
        return x.Currency == currency;
      });
      var filtered_bleutrade = filtered_bleutrade_arr[0];
      ret.withdraw_fee = filtered_bleutrade.TxFee;
      ret.isActive = filtered_bleutrade.isActive;
      ret.symbol = currency;
      return ret;
    } catch (e) {
      loggerpino.error(e);
      return null;
    }
  }

  function parseBittrexFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",
        isActive: 0,
      };
      //console.log(info);
      //console.log(currency);
      var results = info.result;
      //console.log("info: " + info);
      var filtered_bittrex_arr = results.filter(function (x) {
        return x.Currency == currency;
      });

      console.log("--------------------------------");

      var filtered_bittrex = filtered_bittrex_arr[0];
      console.log(filtered_bittrex);
      ret.withdraw_fee = filtered_bittrex.TxFee;
      ret.isActive = filtered_bittrex.IsActive;
      ret.symbol = currency;

      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }

  function parseBitsaneFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: 0,
      };
      var fees = info[currency];
      console.log(fees);
      ret.deposit_fee = fees.deposit_fee;
      ret.withdraw_fee = fees.withdrawal_fee;
      if (fees.deposit == false || fees.withdrawal == false) {
        ret.isActive = false;
      } else {
        ret.isActive = true;
      }

      ret.symbol = currency;
      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }

  function parseAnybitFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: 0,
      };
      var fees = info[currency];
      ret.deposit_fee = fees.deposit_fee;
      ret.withdraw_fee = fees.withdrawal_fee;
      if (fees.deposit == false || fees.withdrawal == false) {
        ret.isActive = false;
      } else {
        ret.isActive = true;
      }

      ret.symbol = currency;
      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }

  function parseHitbtcFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: "string",
        symbol: "string",
        paymentID: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: 0,
      };

      console.log("CURRENCY:" + currency);

      var filtered_hitbtc_arr = info.filter(function (x) {
        return x.id == currency;
      });

      var filtered_hitbtc = filtered_hitbtc_arr[0];
      console.log(filtered_hitbtc);

      ret.symbol = filtered_hitbtc.id;
      ret.withdraw_fee = filtered_hitbtc.payoutFee;

      console.log("------------------------------------------------------");
      console.log("payout:" + filtered_hitbtc.payoutEnabled);
      console.log("payin:" + filtered_hitbtc.payinEnabled);
      console.log("delisted:" + filtered_hitbtc.delisted);

      console.log("payout var type:" + typeof filtered_hitbtc.payoutEnabled);
      console.log("-------------------------------------------------------");

      if (
        filtered_hitbtc.payinEnabled == false ||
        filtered_hitbtc.payoutEnabled == false ||
        filtered_hitbtc.delisted == true
      ) {
        ret.isActive = false;
      } else {
        ret.isActive = true;
      }

      if (filtered_hitbtc.payoutIsPaymentId == true) {
        ret.paymentID = filtered_hitbtc.payinPaymentId;
      }

      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }

  function parseCrex24Fees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: 0,
        symbol: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: 0,
      };

      var currencies = info.Currencies;
      var filtered_crex24_arr = currencies.filter(function (x) {
        return x.ShortName == currency;
      });
      var filtered_crex24 = filtered_crex24_arr[0];
      //console.log(filtered_crex24_arr)
      ret.symbol = filtered_crex24.ShortName;
      if (
        filtered_crex24.Disabled ||
        filtered_crex24.Delisted ||
        filtered_crex24.Frozen
      ) {
        ret.isActive = false;
      } else {
        ret.isActive = true;
      }

      ret.withdraw_fee = filtered_crex24.TxFee;
      ret.withdraw_max = filtered_crex24.MaximumWithdraw;
      ret.withdraw_min = filtered_crex24.MinimalWithdraw;
      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }

  function praseLiveCoinFees(info, currency) {
    try {
      var ret = {
        withdraw_min: 0,
        withdraw_max: 0,
        deposit_min: 0,
        deposit_max: 0,
        deposit_fee: 0,
        withdraw_fee: 0,
        symbol: "string",

        //this is for any feature that is apart of the arbitrage process does not work, it can one thing to a combination. ex: can not withdraw
        isActive: 0,
      };
      //console.log("============");
      //console.log(info)
      //console.log("============");
      var infoArray = info.info;
      //console.log("currency:");
      //console.log(currency);
      //console.log(infoArray[0]);
      var filtered_livecoin_arr = infoArray.filter(function (x) {
        return x.symbol == currency;
      });

      var filtered_livecoin = filtered_livecoin_arr[0];
      //console.log("array:-------")
      // console.log(filtered_livecoin_arr)
      //console.log("-------------")
      ret.symbol = filtered_livecoin.symbol;
      var wallet_status = filtered_livecoin.walletStatus;

      var check = true;

      switch (wallet_status) {
        case "delayed":
          check = false;
          break;
        case "blocked":
          check = false;
          break;
        case "blocked_long":
          check = false;
          break;
        case "down":
          check = false;
          break;
        case "delisted":
          check = false;
          break;
        case "closed_cashin":
          check = false;
          break;
        case "closed_cashout":
          check = false;
          break;
      }

      ret.isActive = check;
      ret.withdraw_fee = filtered_livecoin.withdrawFee;
      ret.deposit_min = filtered_livecoin.minDepositAmount;
      ret.withdraw_min = filtered_livecoin.minWithdrawAmount;
      //no deposit fee

      return ret;
    } catch (e) {
      loggerPino.error(e);
      return null;
    }
  }
};

module.exports = parkersFunction;

CryptoUtil = {};

CryptoUtil.getCoinStatAvgPrices = function (skip, limit, success, fail) {
  parkersFunction.getRequest(
    "https://api.coinstats.app/public/v1/coins?skip=" +
      skip +
      "&limit=" +
      limit,
    function (json) {
      success(json);
    },
    function (err) {
      loggerPino.info(err);
      fail(err);
    },
    "GET",
    null,
    null
  );
};

CryptoUtil.getMarketsOfCoin = function (coin, success, fail) {
  parkersFunction.getRequest(
    "https://api.coinstats.app/public/v1/markets?coinId=" + coin,
    success,
    fail,
    "GET",
    null,
    null
  );
};

CryptoUtil.getNews = function (skip, limit, success, fail) {
  parkersFunction.getRequest(
    "https://api.coinstats.app/public/v1/news?skip=" + skip + "&limit=" + limit,
    success,
    fail,
    "GET",
    null,
    null
  );
};

CryptoUtil.getFiatCurrencies = function (success, fail) {
  parkersFunction.getRequest(
    "https://api.coinstats.app/public/v1/fiats",
    success,
    fail,
    "GET",
    null,
    null
  );
};

CryptoUtil.betterGetRequest = function (url, method, headers, body) {
  parkersFunction.getRequest(
    url,
    function (json) {
      return json;
    },
    function (err) {
      return err;
    },
    method,
    headers,
    body
  );
};

CryptoUtil.getCryptoPanicArticles = function (token, currency, success, fail) {
  parkersFunction.getRequest(
    "https://cryptopanic.com/api/v1/posts/?auth_token=" +
      token +
      "&currencies=" +
      currency,
    success,
    fail,
    "GET",
    null,
    null
  );
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options_swag)
);

app.use(compression()); // use compression
app.use(express.static(path.join(__dirname, "public")));
const loggerPino = pino({
  prettyPrint: {
    colorize: true,
  },
});

const loggerPinoExpress = pino_express({
  prettyPrint: {
    colorize: true,
  },
});

const port = 3000;

app.use(loggerPinoExpress);

const optimized = true;
const setEnableRateLimit = true;

const error = {
  url: "str",
  headers: {},
  exception: null,
  exchange: "str",
  endpoint: "str",
};

server = {};

const timeoutConst = 90000;
async function getExchange(
  name,
  apiKey,
  apiSecret,
  password,
  uid,
  marketSetPrice
) {
  try {
    loggerPino.info("The exchange selected is " + name);
    switch (name) {
      case "binance":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.binance({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
            options: {
              createMarketBuyOrderRequiresPrice: marketSetPrice,
            },
          });
        } else {
          return await new ccxt.binance({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "hitbtc":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.hitbtc({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.hitbtc({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "bittrex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bittrex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
            options: {
              createMarketBuyOrderRequiresPrice: marketSetPrice,
            },
          });
        } else {
          return await new ccxt.bittrex({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "bitfinex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitfinex2({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitfinex2({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "kraken":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.kraken({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.kraken({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "theocean":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.theocean({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.theocean({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "upbit":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.upbit({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.upbit({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "acx":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.acx({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.acx({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "cex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.cex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.cex({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "bitstamp":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitstamp({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            uid: uid,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitstamp({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "bithumb":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bithumb({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bithumb({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "coinbase":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinbase({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.coinbase({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "coinbasepro":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinbasepro({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            password: password,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.coinbasepro({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "bcex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bcex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bcex({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "_1btcxe":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt._1btcxe({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt._1btcxe({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "anxpro":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.anxpro({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.anxpro({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "bibox":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bibox({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bibox({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bigone":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bigone({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bigone({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bit2c":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bit2c({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bit2c({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bitbank":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitbank({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitbank({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bitbay":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitbay({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitbay({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bitflyer":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitflyer({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitflyer({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bitforex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitforex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitforex({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "bitkk":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitkk({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitkk({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bitlish":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitlish({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitlish({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bitmarket":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitmarket({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitmarket({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bitmex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitmex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitmex({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "bitso":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitso({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitso({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bitz":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bitz({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bitz({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bl3p":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bl3p({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bl3p({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "bleutrade":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bleutrade({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.bleutrade({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "braziliex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.braziliex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.braziliex({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "btcalpha":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.btcalpha({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.btcalpha({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "btcbox":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.btcbox({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.btcbox({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "btcchina":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.btcchina({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.btcchina({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "btcmarkets":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.btcmarkets({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.btcmarkets({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "btctradeua":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.btctradeua({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.btctradeua({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "btcturk":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.btcturk({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.btcturk({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "buda":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.buda({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.buda({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }
      case "chilebit":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.chiebit({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.chilebit({
            enableRateLimit: setEnableRateLimit,
            timeout: timeoutConst,
          });
        }

      case "cobinhood":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.cobinhood({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: timeoutConst,
          });
        } else {
          return await new ccxt.cobinhood({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coinbaseprime":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinbaseprime({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coinbaseprime({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coincheck":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coincheck({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coincheck({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coinegg":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinegg({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coinegg({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coinex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coinex({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coinfalcon":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinfalcon({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coinfalcon({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coinfloor":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinfloor({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coinfloor({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coingi":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coingi({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coingi({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coinmarketcap":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinmarketcap({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coinmarketcap({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coinmate":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinmate({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coinmate({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coinone":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinone({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coinone({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coinspot":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coinspot({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coinspot({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "cointiger":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.cointiger({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.cointiger({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "coolcoin":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coolcoin({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.coolcoin({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "crex24":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.crex24({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 60000,
          });
        } else {
          return await new ccxt.crex24({
            enableRateLimit: setEnableRateLimit,
            timeout: 60000,
          });
        }

      case "dsx":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.dsx({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.dsx({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "exmo":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.exmo({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.exmo({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "exx":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.exx({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.exx({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "fcoin":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.fcoin({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.fcoin({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "flowbtc":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.flowbtc({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.flowbtc({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "foxbit":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.foxbit({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.foxbit({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "fybse":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.fybse({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.fybse({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "fybsg":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.fybsg({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.fybsg({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "gateio":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.gateio({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.gateio({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "gemini":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.gemini({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.gemini({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "hadax":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.hadax({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.hadax({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "huobipro":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.huobipro({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.huobipro({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "ice3x":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.ice3x({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.ice3x({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "independentreserve":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.independentreserve({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.independentreserve({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "indodax":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.indodax({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.indodax({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "itbit":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.itbit({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.itbit({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "kkex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.kkex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.kkex({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "kucoin":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.kucoin({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.kucoin({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "kuna":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.kuna({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.kuna({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "lakebtc":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.lakebtc({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.lakebtc({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "liqui":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.liqui({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.liqui({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "livecoin":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.livecoin({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.livecoin({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "luno":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.luno({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.luno({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "lykke":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.lykke({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.lykke({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "mercado":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.mercado({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.mercado({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "mixcoins":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.mixcoins({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.mixcoins({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "okcoinusd":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.okcoinusd({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.okcoinusd({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "okex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.okex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.okex({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "paymium":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.paymium({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.paymium({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "poloniex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.poloniex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
            nonce: function () {
              return new Date().getTime();
            },
          });
        } else {
          return await new ccxt.poloniex({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
            nonce: function () {
              return new Date().getTime();
            },
          });
        }

      case "quoinex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.quoinex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.quoinex({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "rightbtc":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.rightbtc({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.rightbtc({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "southxchange":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.southxchange({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.southxchange({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "surbitcoin":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.surbitcoin({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.surbitcoin({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "therock":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.therock({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.therock({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "tidebit":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.tidebit({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.tidebit({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "tidex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.tidex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.tidex({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "vaultoro":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.vaultoro({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.vaultoro({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "vbtc":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.vbtc({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.vbtc({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "xbtce":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.xbtce({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.xbtce({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "yobit":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.yobit({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.yobit({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "zaif":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.zaif({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.zaif({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "zb":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.zb({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.zb({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "whitebit":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.whitebit({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.whitebit({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }
      case "topq":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.topq({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.topq({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "timex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.timex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.timex({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "stex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.stex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.stex({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "stronghold":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.stronghold({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.stronghold({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "oceanex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.oceanex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.oceanex({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "lbank":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.lbank({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.lbank({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "latoken":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.latoken({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.latoken({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "hollaex":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.hollaex({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.hollaex({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "fcoinjp":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.fcoinjp({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.fcoinjp({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "deribit":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.deribit({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.deribit({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "coss":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.coss({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.coss({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "bytetrade":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bytetrade({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.bytetrade({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      case "bybit":
        if (apiKey !== undefined && apiSecret !== undefined) {
          return await new ccxt.bybit({
            enableRateLimit: setEnableRateLimit,
            apiKey: apiKey,
            secret: apiSecret,
            timeout: 40000,
          });
        } else {
          return await new ccxt.bybit({
            enableRateLimit: setEnableRateLimit,
            timeout: 40000,
          });
        }

      default:
        // console.log("Did not find the exchange that was requested");
        return null;
    }
  } catch (e) {
    console.log(e.stack);
    return null;
  }
}

function getCurrentDateTimeString() {
  try {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }
    const time = today.getTime();
    today = mm + "_" + dd + "_" + yyyy + "_" + time;
    return today;
  } catch (e) {
    console.log(e);
    return "errorGettingDate";
  }
}

function writeFile(filename, content, foldername) {
  try {
    if (!fs.existsSync("logs")) {
      fs.mkdirSync("logs");
    }
    if (!fs.existsSync("logs\\" + foldername)) {
      fs.mkdirSync("logs\\" + foldername);
    }

    var date = getCurrentDateTimeString();
    filename = filename + date + ".txt";
    fs.writeFile(filename, content, function (err) {
      if (err) {
        return console.log(err);
      }
      loggerPino.error("LOGGED CALL FOR RECORDS");
    });
  } catch (e) {
    console.log(e);
  }

  date = getCurrentDateTimeString();
  filename = filename + date + ".txt";
  fs.writeFile(filename, content, function (err) {
    if (err) {
      return console.log(err);
    }
    loggerPino.info("LOGGED CALL FOR RECORDS");
  });
}

app.get("/describe", async (req, res) => {
  // var headers = JSON.parse(req.headers.credentials)
  try {
    const exchange = await getExchange(req.query.exchange);

    const desc = exchange.describe();
    // req.log.info(desc);
    res.json(desc);
  } catch (e) {
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
    const error = {
      error: true,
      message: e,
      stack: e.stack,
    };
    res.json(error);
  }
});

// localhost/getOrderBook?exchange={}&symbol={}
app.get("/getOrderBook", async (req, res) => {
  try {
    const exchange = await getExchange(req.query.exchange);
    exchange.enableRateLimit = true;
    const symbol = req.query.symbol;
    const orderBooks = await exchange.fetchOrderBook(symbol);

    res.json(orderBooks);
  } catch (e) {
    const error = {
      error: true,
      message: e,
      stack: e.stack,
    };
    res.json(error);
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
  }
});

app.get("/ListOfExchanges", async (req, res) => {
  const exchanges = [
    "_1btcxe",
    "acx",
    "adara",
    "anxpro",
    "aofex",
    "bcex",
    "bequant",
    "bibox",
    "bigone",
    "binance",
    "binanceje",
    "binanceus",
    "bit2c",
    "bitbank",
    "bitbay",
    "bitfinex2",
    "bitflyer",
    "bitforex",
    "bithumb",
    "bitkk",
    "bitlish",
    "bitmart",
    "bitmax",
    "bitmex",
    "bitso",
    "bitstamp",
    "bittrex",
    "bitz",
    "bl3p",
    "bleutrade",
    "braziliex",
    "btcalpha",
    "btcbox",
    "btcmarkets",
    "btctradeim",
    "btctradeua",
    "btcturk",
    "buda",
    "bw",
    "bybit",
    "bytetrade",
    "cex",
    "chilebit",
    "cobinhood",
    "coinbase",
    "coinbaseprime",
    "coinbasepro",
    "coincheck",
    "coinegg",
    "coinex",
    "coinfalcon",
    "coinfloor",
    "coingi",
    "coinmarketcap",
    "coinmate",
    "coinone",
    "coinspot",
    "coolcoin",
    "coss",
    "crex24",
    "deribit",
    "digifinex",
    "dsx",
    "exmo",
    "exx",
    "fcoin",
    "fcoinjp",
    "flowbtc",
    "foxbit",
    "ftx",
    "fybse",
    "gateio",
    "gemini",
    "hitbtc",
    "hollaex",
    "huobipro",
    "huobiru",
    "ice3x",
    "idex",
    "independentreserve",
    "indodax",
    "itbit",
    "kkex",
    "kraken",
    "kucoin",
    "kuna",
    "lakebtc",
    "latoken",
    "lbank",
    "liquid",
    "livecoin",
    "luno",
    "lykke",
    "mercado",
    "mixcoins",
    "oceanex",
    "okcoin",
    "okex",
    "paymium",
    "poloniex",
    "rightbtc",
    "southxchange",
    "stex",
    "stronghold",
    "surbitcoin",
    "theocean",
    "therock",
    "tidebit",
    "tidex",
    "timex",
    "topq",
    "upbit",
    "vaultoro",
    "VBTC",
    "whitebit",
    "xbtce",
    "yobit",
    "zaif",
    "zb",
  ];

  res.json(exchanges);
});

app.get("/transferMainToTrade", async (req, res) => {
  try {
    const headers = JSON.parse(req.headers.credentials);
    const symbol = req.query.symbol;
    const amount = req.headers.amount;
    const api_key = headers.apiKey;
    const api_secret = headers.apiSecret;
    const exchange = await getExchange(
      req.query.exchange,
      api_key.trim(),
      api_secret.trim()
    );

    exchange.enableRateLimit = true;
    if (exchange !== null || exchange !== undefined) {
      exchange.private_post_account_transfer({
        currency: symbol,
        amount: parseFloat(amount),
        type: "bankToExchange",
      });
      res.json({
        success: true,
      });
    } else {
      var error = {
        error: true,
        message: "could not get exchange",
        stack: "-",
      };
      console.log("-------------------------");
      req.log.error("could not get exchange");
      console.log("-------------------------");
      res.json(error);
    }
  } catch (e) {
    error = {
      error: true,
      message: e,
      stack: e.stack,
    };
    res.json(error);
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
  }
});

app.get("/transferTradeToMain", async (req, res) => {
  try {
    const headers = JSON.parse(req.headers.credentials);
    const symbol = req.query.symbol;
    const amount = req.headers.amount;
    const api_key = headers.apiKey;
    const api_secret = headers.apiSecret;
    const exchange = await getExchange(
      req.query.exchange,
      api_key.trim(),
      api_secret.trim()
    );
    exchange.enableRateLimit = true;
    if (exchange !== null && exchange !== undefined) {
      exchange.private_post_account_transfer({
        currency: symbol,
        amount: parseFloat(amount),
        type: "exchangeToBank",
      });
      res.json({
        success: true,
      });
    } else {
      var error = {
        error: true,
        message: "not able to get exchange",
        stack: "-",
      };
      console.log("-------------------------");
      req.log.error(error);
      console.log("-------------------------");
      res.json(error);
    }
  } catch (e) {
    error = {
      error: true,
      message: e,
      stack: e.stack,
    };
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
    req.log.info(e);
    res.json(error);
  }
});

// localhost/balance?exchange={}
app.get("/balance", async (req, res) => {
  try {
    const headers = JSON.parse(req.headers.credentials);

    const api_key = headers.apiKey;
    const api_secret = headers.apiSecret;

    const _type = req.query.type;
    const currency = req.query.currency;
    let exchange;
    console.log(req.query.exchange);
    console.log(headers);
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          req.query.exchange,
          api_key.trim(),
          api_secret.trim()
        );
      } else {
        exchange = await getExchange(
          req.query.exchange,
          api_key.trim(),
          api_secret.trim(),
          null,
          headers.uid.trim()
        );
      }
    } else {
      exchange = await getExchange(
        req.query.exchange,
        api_key.trim(),
        api_secret.trim(),
        headers.password.trim()
      );
    }

    let balance = null;
    if (_type !== undefined) {
      balance = await exchange.fetchBalance({
        type: _type,
      });
    } else {
      balance = await exchange.fetchBalance();
    }
    console.log("balance: ", balance);
    const bal_ret = parseBalance(balance, req.query.exchange, currency);

    if (!optimized) {
      writeFile(
        "logs\\getBalance\\getBalance",
        JSON.stringify(bal_ret),
        "getBalance"
      );
    }

    res.json(bal_ret);
  } catch (e) {
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
    writeFile("logs\\errorBalance\\errorBalance.txt", e);
    const error = {
      error: true,
      message: e,
      stack: e.stack,
    };
    res.json(error);
  }
});

app.get("/cancelOrder", async (req, res) => {
  try {
    const headers = JSON.parse(req.headers.credentials);
    const tradeID = req.query.id;
    let exchange;
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim()
        );
      } else {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          headers.uid.trim()
        );
      }
    } else {
      exchange = await getExchange(
        req.query.exchange,
        headers.apiKey.trim(),
        headers.apiSecret.trim(),
        headers.password.trim()
      );
    }
    exchange.enableRateLimit = true;

    const cancel = await exchange.cancelOrder(tradeID);
    // req.log.info(cancel);
    res.json(cancel);
  } catch (e) {
    req.log.error(e);
    writeFile(
      "logs\\errorCancelOrder\\errorCancelOrder",
      e,
      "errorCancelOrder"
    );
    const error = {
      error: true,
      message: e,
    };
    res.json(error);
  }
});

app.get("/withdrawDepositHistory", async (req, res) => {
  try {
    const headers = JSON.parse(req.headers.credentials);
    const exchangeName = req.query.exchange;
    let exchange;
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          exchangeName,
          headers.apiKey.trim(),
          headers.apiSecret.trim()
        );
      } else {
        exchange = await getExchange(
          exchangeName,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          headers.uid.trim()
        );
      }
    } else {
      exchange = await getExchange(
        exchangeName,
        headers.apiKey,
        headers.apiSecret,
        headers.password.trim()
      );
    }
    exchange.enableRateLimit = true;
    const with_history = await exchange.fetchWithdrawals();
    const dep_histroy = await exchange.fetchDeposits();
    const withDepHist = {
      withdraw: with_history,
      deposit: dep_histroy,
    };

    // req.log.info(withDepHist);
    res.json(withDepHist);
  } catch (e) {
    req.log.error(e);
    writeFile(
      "logs\\errorWithdrawDepositHist\\errorWithdrawDepositHist",
      e,
      "errorWithdrawDepositHist"
    );
    const error = {
      error: true,
      message: e,
    };
    res.json(error);
  }
});

// localhost/order?exchange={}&side={}&type={}&symbol={}&price={}&quantity={}
app.get("/order", async (req, res) => {
  // var price_quantity_data = JSON.parse(req.headers.priceQuantity)
  try {
    const headers = JSON.parse(req.headers.credentials);
    const tradeID = req.headers.tradeID;
    const marketPrice = req.query.setMarketPrice;
    var checkPrice = false;
    if (marketPrice === "true") {
      checkPrice = true;
    }
    let exchange;
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          null,
          checkPrice
        );
      } else {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          headers.uid.trim(),
          checkPrice
        );
      }
    } else {
      exchange = await getExchange(
        req.query.exchange,
        headers.apiKey,
        headers.apiSecret,
        headers.password.trim(),
        null,
        checkPrice
      );
    }
    exchange.enableRateLimit = true;
    if (exchange !== null || exchange !== undefined) {
      const quantity = req.headers.quantity;
      const price = req.headers.price;

      const timeInForce = req.headers.timeInForce;

      let order;
      if (timeInForce === null) {
        if (checkPrice === true && req.query.type === "market") {
          order = await exchange.createOrder(
            req.query.quoteCur + "/" + req.query.baseCur,
            req.query.type,
            req.query.side,
            quantity,
            price
          );
        } else {
          order = await exchange.createOrder(
            req.query.quoteCur + "/" + req.query.baseCur,
            req.query.type,
            req.query.side,
            quantity,
            price
          );
        }

        // req.log.info(order);
        if (!optimized) {
          writeFile(
            "logs\\performOrder\\performOrder",
            JSON.stringify(order) + "     timeInForce: " + timeInForce,
            "performOrder"
          );
        }
      } else {
        order = await exchange.createOrder(
          req.query.quoteCur + "/" + req.query.baseCur,
          req.query.type,
          req.query.side,
          quantity,
          price,
          {
            timeInForce: timeInForce,
          }
        );
        // req.log.info(order);
        if (!optimized) {
          writeFile(
            "logs\\performOrder\\performOrder",
            JSON.stringify(order) + "     timeInForce: " + timeInForce,
            "performOrder"
          );
        }
      }

      res.json(order);
    } else {
      var error = {
        error: true,
        message: "not able to get exchange",
        stack: "-",
      };
      console.log("-------------------------");
      req.log.error(error);
      console.log("-------------------------");
      res.json(error);
    }
  } catch (e) {
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
    writeFile("logs\\errorOrder\\errorOrder", e, "errorOrder");
    error = {
      error: true,
      message: e,
      stack: e.stack,
    };
    res.json(error);
  }
});

// localhost/cancelOrder?exchange={}&id={}
/* app.get('/performWithdraw', async (req, res, next) => {
    var headers = JSON.parse(req.headers.credentials)
    try {
        var exchange = getExchange(req.query.exchange)
        var order = await exchange.withdraw(headers.id)
        console.log(order)
        res.json(order)
    } catch (e) {
        //TODO handle the error
        next(e)
    }
}) */

// localhost/getOpenOrders?exchange={}&symbol={}
app.get("/getOpenOrders", async (req, res) => {
  try {
    const headers = JSON.parse(req.headers.credentials);
    let exchange;
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim()
        );
      } else {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          headers.uid.trim()
        );
      }
    } else {
      exchange = await getExchange(
        req.query.exchange,
        headers.apiKey,
        headers.apiSecret,
        headers.password.trim()
      );
    }
    if (exchange !== null || exchange !== undefined) {
      const tradeID = req.headers.tradeID;
      const symbolBase = req.query.symbolBase;
      const symbolQuote = req.query.symbolQuote;
      /* var order = await exchange.fetchOpenOrders(req.query.baseCur + "/" + req.query.quoteCur)
                    console.log(order)
                    res.json(order) */

      console.log(exchange);
      // if (exchange.has['fetchOpenOrders']) {
      const since = exchange.milliseconds(); // -1 day from now
      // alternatively, fetch from a certain starting datetime
      // let since = exchange.parse8601 ('2018-01-01T00:00:00Z')
      const allTrades = [];

      const limit = 20; // change for your limit
      let trades;
      if (symbolBase === undefined && symbolQuote === undefined) {
        trades = await exchange.fetchOpenOrders(); // symbol, since, limit)
      } else {
        trades = await exchange.fetchOpenOrders(symbolBase + "/" + symbolQuote); // symbol, since, limit)
      }

      // req.log.info(trades);
      if (!optimized) {
        writeFile(
          "logs\\getOpenOrders\\getOpenOrders",
          trades,
          "getOpenOrders"
        );
      }
      res.json(trades);

      // }
      req.log.info("has fetchOpenOrders: " + exchange.has.fetchOpenOrders);
    } else {
      var error = {
        error: true,
        message: "not able to get exchange",
        stack: "-",
      };
      console.log("-------------------------");
      req.log.error(error);
      console.log("-------------------------");
      res.json(error);
    }
  } catch (e) {
    req.log.error(e);
    writeFile("logs\\errorOpenOrders\\errorOpenOrders", e, "errorOpenOrders");
    error = {
      error: true,
      message: e,
      stack: e.stack,
    };
    res.json(error);
  }
});

// localhost/getOpenOrders?exchange={}&symbol={}
app.get("/getTickerData", async (req, res) => {
  try {
    const exchange = await getExchange(req.query.exchange);
    if (exchange !== null || exchange !== undefined) {
      const base_cur = req.query.baseCur;
      const quote_cur = req.query.quoteCur;

      console.log("base currency: " + base_cur);
      console.log("quote currency:" + quote_cur);
      let ticker = null;

      ticker = await exchange.fetchTicker(base_cur + "/" + quote_cur);

      if (!optimized) {
        writeFile(
          "logs\\getTickerData\\getTickerData",
          JSON.stringify(ticker),
          "getTickerData"
        );
      }
      res.json(ticker);
    } else {
      var error = {
        error: true,
        message: "not able to get exchange",
        stack: "-",
      };
      console.log("-------------------------");
      req.log.error(error);
      console.log("-------------------------");
      res.json(error);
    }
  } catch (e) {
    req.log.error(e);

    writeFile("logs\\errorTickerData\\errorTickerData", e, "errorTickerData");
    error = {
      error: true,
      message: e,
      stack: e.stack,
    };
    res.json(error);
    // next(e)
  }
});

// localhost/getOrders?exchange={}&symbol={}
app.get("/getOrders", async (req, res) => {
  try {
    const headers = JSON.parse(req.headers.credentials);
    let exchange;
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim()
        );
      } else {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          headers.uid.trim()
        );
      }
    } else {
      exchange = await getExchange(
        req.query.exchange,
        headers.apiKey,
        headers.apiSecret,
        headers.password.trim()
      );
    }
    const order = await exchange.fetchOrders(headers.symbol.replace("-", "/"));
    // req.log.info(order);
    res.json(order);
  } catch (e) {
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
    // TODO handle the error
    const error = {
      error: true,
      message: e,
      stack: e.stack,
    };
    res.json(error);
    // next(e)
  }
});

app.get("/getOHLCV", async (req, res) => {
  try {
    // var headers = JSON.parse(req.headers.credentials);
    const baseCur = req.query.baseCur;
    const quoteCur = req.query.quoteCur;
    const timeFrame = req.query.timeframe;
    const exchange = await getExchange(req.query.exchange);
    const OHLCV = await exchange.fetchOHLCV(
      baseCur + "/" + quoteCur,
      timeFrame
    );

    const index = 0;
    const final = [];

    // var arr = OHLCV[0]
    // console.log("------------------------------------------------------------");
    const plus = {
      timestamp: [],
      openPrice: [],
      highPrice: [],
      lowPrice: [],
      closePrice: [],
      volume: [],
    };
    for (var xx in OHLCV) {
      const hist = OHLCV[xx];

      for (var x in hist) {
        const dat = hist[x];
        // console.log(x);
        switch (x) {
          case "0":
            plus.timestamp.push(dat);

            break;

          case "1":
            plus.openPrice.push(dat);

            break;

          case "2":
            plus.highPrice.push(dat);

            break;

          case "3":
            plus.lowPrice.push(dat);

            break;

          case "4":
            plus.closePrice.push(dat);

            break;

          case "5":
            plus.volume.push(dat);

            break;
        }
      }
    }
    res.json(plus);
  } catch (e) {
    req.log.error(e);
    const error = {
      error: true,
      message: e,
    };
    res.json(error);
  }
});

process.on("uncaughtException", function (err) {
  try {
    console.log("//////////////////////////////////////////////////////");
    console.log(new Date().toUTCString() + " uncaught Exception: ");
    console.log(err);
    fs.writeSync(1, `Caught exception: ${err}\n`);
    console.log("//////////////////////////////////////////////////////");
    writeFile("logs\\crashLog\\crashLog", err, "crashLog");
    process.exit(1);
  } catch (e) {
    process.exit(1);
  }
});

process.on("warning", (warning) => {
  console.warn(warning.name); // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack); // Print the stack trace
});

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at:", p, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});

app.get("/getMinMaxTradeAmount", async (req, res) => {
  try {
    const baseCur = req.query.baseCur;
    const quoteCur = req.query.quoteCur;
    const exchangeName = req.query.exchange;
    const exchange = await getExchange(exchangeName);

    const mrks = await exchange.fetchMarkets();
    const filteredMrk = mrks.filter(function (x) {
      return x.symbol === baseCur + "/" + quoteCur;
    });
    const f = filteredMrk[0];

    // req.log.info(f);

    console.log(f);
    console.log("------------");

    var min_max = null;
    if (exchangeName === "binance") {
      min_max = {
        amount_min: f.limits.amount.min,
        // amount_max: filteredMrk.limits.amount.max,
        price_min: f.limits.price.min,
        // price_max: filteredMrk.limits.price.max,
        cost_min: f.limits.cost.min,
        // cost_max: filteredMrk.limits.cost.max,
        symbol: baseCur + "/" + quoteCur,
        baseCur: baseCur,
        quoteCur: quoteCur,
        exchange: exchangeName,
      };
    }

    if (exchangeName === "hitbtc") {
      min_max = {
        amount_min: f.limits.amount.min,
        // amount_max: filteredMrk.limits.amount.max,
        price_min: f.limits.price.min,
        // price_max: filteredMrk.limits.price.max,
        cost_min: f.limits.cost.min,
        // cost_max: filteredMrk.limits.cost.max,
        symbol: baseCur + "/" + quoteCur,
        baseCur: baseCur,
        quoteCur: quoteCur,
        exchange: exchangeName,
      };
    }

    if (exchangeName === "bittrex") {
      min_max = {
        amount_min: f.limits.amount.min,
        // amount_max: filteredMrk.limits.amount.max,
        price_min: f.limits.price.min,
        // price_max: filteredMrk.limits.price.max,
        cost_min: 0,
        // cost_max: filteredMrk.limits.cost.max,
        symbol: baseCur + "/" + quoteCur,
        baseCur: baseCur,
        quoteCur: quoteCur,
        exchange: exchangeName,
      };
    }

    // req.log.info(min_max);
    res.json(min_max);
  } catch (e) {
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
    const error = {
      error: true,
      message: e,
    };
    res.json(error);
  }
});

app.get("/getTradeHistory", async (req, res) => {
  try {
    const exchangeName = req.query.exchange;
    const symbol = req.query.symbol;

    const headers = JSON.parse(req.headers.credentials);
    const dateReq = headers.date;
    let exchange;
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          exchangeName,
          headers.apiKey.trim(),
          headers.apiSecret.trim()
        );
      } else {
        exchange = await getExchange(
          exchangeName,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          headers.uid.trim()
        );
      }
    } else {
      exchange = await getExchange(
        exchangeName,
        headers.apiKey,
        headers.apiSecret,
        headers.password.trim()
      );
    }

    // var trades = await exchange.fetchTrades(symbol);
    let date;
    if (dateReq === undefined) {
      date = new Date("5/23/2017");
    } else {
      date = new Date(dateReq);
    }
    console.log("date: " + date);
    const trades = await exchange.fetchTrades(
      symbol,
      date.getMilliseconds(),
      1000
    );
    const tradeRet = {
      tradeData: trades,
    };
    // req.log.info(tradeRet);
    res.json(tradeRet);
  } catch (e) {
    req.log.error(e);
    const error = {
      error: true,
      message: e,
    };
    res.json(error);
  }
});

// localhost/getExchangeTradeFees?exchange={}
app.get("/getExchangeTradeFees", async (req, res, next) => {
  var fees = {
    hitbtc: "0.1",
    bittrex: "0.25",
    poloniex: "0.2",
    cobinhood: "0.0",
    binance: "0.1",
    anybits: "0.25",
    bitsane: "0.2",
    bleutrade: "0.25",
    buda: "0.8",
    crex24: "0.1",
    livecoin: "0.18",
    kraken: "0.26",
    percentages: true,
  };
  res.json(fees);
  /* try {
      // var symbol = req.query.symbol;
      const baseCur = req.query.baseCur
      const quoteCur = req.query.quoteCur
      const exchangeName = req.query.exchange
      const exchange = await getExchange(exchangeName)
      if (exchange !== null && exchange !== undefined) {
        const check = exchange.describe().has.fetchTradingFees

        if (check === true) {
          try {
            var fee = await exchange.fetchTradingFees()
            // req.log.info("trading fee:");
            // req.log.info(fee);
            res.json(fee)
          } catch (e) {

            // req.log.info(fee);

          }
        } else {
          try {
            const mark = await exchange.fetchMarkets()
            const filteredMrk = mark.filter(function (x) {
              return x.symbol === baseCur + '/' + quoteCur
            })

            // req.log.error(filteredMrk);

            const taker_maker = {
              taker: filteredMrk['0'].taker,
              maker: filteredMrk['0'].maker
            }

            if (taker_maker.maker !== undefined && taker_maker.maker !== null && taker_maker.maker !== '') {
              fees = {
                percentages: true
              }

              switch (exchangeName) {
                case 'hitbtc':
                  // console.log("HITBTC");
                  fees.hitbtc = parseFloat(taker_maker.maker) * 100
                  break
                case 'bittrex':
                  fees.bittrex = parseFloat(taker_maker.maker) * 100
                  break
                case 'poloniex':
                  fees.poloniex = parseFloat(taker_maker.maker) * 100
                  break
                case 'cobinhood':
                  fees.cobinhood = parseFloat(taker_maker.maker) * 100
                  break
                case 'anybits':
                  fees.anybits = parseFloat(taker_maker.maker) * 100
                  break
                case 'bitsane':
                  fees.bitsane = parseFloat(taker_maker.maker) * 100
                  break
                case 'bleutrade':
                  fees.bleutrade = parseFloat(taker_maker.maker) * 100
                  break
                case 'buda':
                  fees.buda = parseFloat(taker_maker.maker) * 100
                  break
                case 'crex24':
                  fees.crex24 = parseFloat(taker_maker.maker) * 100
                  break
                case 'livecoin':
                  fees.livecoin = parseFloat(taker_maker.maker) * 100
                  break
                case 'kraken':
                  fees.kraken = parseFloat(taker_maker.maker) * 100
                  break
                case 'binance':
                  fees.binance = parseFloat(taker_maker.maker) * 100
                  break

                  // need to add other exchanges, but for now just these
              }
              // req.log.info(fees);
              res.json(fees)
            } else {
              var fees = {
                hitbtc: '0.1',
                bittrex: '0.25',
                poloniex: '0.2',
                cobinhood: '0.0',
                binance: '0.1',
                anybits: '0.25',
                bitsane: '0.2',
                bleutrade: '0.25',
                buda: '0.8',
                crex24: '0.1',
                livecoin: '0.18',
                kraken: '0.26',
                percentages: true
              }
              res.json(fees)
            }
          } catch (e) {
            var fees = {
              hitbtc: '0.1',
              bittrex: '0.25',
              poloniex: '0.2',
              cobinhood: '0.0',
              binance: '0.1',
              anybits: '0.25',
              bitsane: '0.2',
              bleutrade: '0.25',
              buda: '0.8',
              crex24: '0.1',
              livecoin: '0.18',
              kraken: '0.26',
              percentages: true
            }
            res.json(fees)
          }
        }
      } else {
        var error = {
          error: true,
          message: 'not able to get exchange',
          stack: '-'
        }
        console.log('-------------------------')
        req.log.error(error)
        console.log('-------------------------')
        res.json(error)
      }
    } catch (e) {
      console.log('-------------------------')
      req.log.error(e.stack)
      console.log('-------------------------')
      var error = {
        error: true,
        message: e
      }
      res.json(error)
      // next(e)
    }*/
});

// localhost/getOrders?exchange={}&baseCur={}&quoteCurr={}
app.get("/getIsPaymentIDRequired", async (req, res, next) => {
  // var headers = JSON.parse(req.headers.credentials)
  try {
    parkersFunction.getIsCoinPaymentID(
      function (inf) {
        const coinIDCol = [];

        for (var x in inf) {
          const coin_inf = inf[x];
          let paymentID_check = false;
          if (
            coin_inf.payinPaymentId === true ||
            coin_inf.payoutIsPaymentId === true
          ) {
            paymentID_check = true;
          }
          const coinID = {
            isPaymentID: paymentID_check,
            isOutPaymentID: coin_inf.payoutIsPaymentId,
            isInPaymentID: coin_inf.payinPaymentId,
            symbol: coin_inf.id,
          };

          coinIDCol.push(coinID);
        }

        res.json(coinIDCol);
        // req.log.info(coinIDCol);
      },
      function (err) {
        console.log("-------------------------");
        req.log.error(err.stack);
        console.log("-------------------------");
        // TODO handle the error

        writeFile(
          "logs\\errorIsPaymentID\\errorIsPaymentID",
          err,
          "errorIsPaymentID"
        );
        const error = {
          error: true,
          message: err,
        };
        res.json(error);
      }
    );
  } catch (e) {
    req.log.error(e);
    // TODO handle the error
    writeFile(
      "logs\\errorIsPaymentID\\errorIsPaymentID",
      e,
      "errorIsPaymentID"
    );
    const error = {
      error: true,
      message: e,
    };
    res.json(error);
    // next(e)
  }
});

// localhost/getOrders?exchange={}&baseCur={}&quoteCurr={}
app.get("/getOrderBooks", async (req, res, next) => {
  // var headers = JSON.parse(req.headers.credentials)
  try {
    const base_cur = req.query.baseCur;
    const quote_cur = req.query.quoteCur;
    const exchange = await getExchange(req.query.exchange); // , headers.apiKey, headers.apiSecret)
    if (exchange !== null && exchange !== undefined) {
      // console.log(headers);

      const order = await exchange.fetchOrderBook(
        req.query.baseCur + "/" + req.query.quoteCur
      );
      if (!optimized) {
        writeFile(
          "logs\\getOrderBooks\\getOrderBooks",
          JSON.stringify(order),
          "getOrderBooks"
        );
      }
      // req.log.info(order);
      res.json(order);
    } else {
      var error = {
        error: true,
        message: "not able to get exchange",
        stack: "-",
      };
      console.log("-------------------------");
      req.log.error(error);
      console.log("-------------------------");
      res.json(error);
    }
  } catch (e) {
    req.log.error(e);
    // TODO handle the error

    writeFile("logs\\errorOrderBooks\\errorOrderBooks", e, "errorOrderBooks");
    var error = {
      error: true,
      message: e,
    };
    res.json(error);
    // next(e)
  }
});

// localhost/getDepositAddress?exchange={}&symbol={}
app.get("/getDepositAddress", async (req, res, next) => {
  try {
    const headers = JSON.parse(req.headers.credentials);
    let exchange;
    const exchangeName = req.query.exchange;
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          exchangeName,
          headers.apiKey.trim(),
          headers.apiSecret.trim()
        );
      } else {
        exchange = await getExchange(
          exchangeName,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          headers.uid.trim()
        );
      }
    } else {
      exchange = await getExchange(
        exchangeName,
        headers.apiKey,
        headers.apiSecret,
        headers.password.trim()
      );
    }
    if (exchange !== null && exchange !== undefined) {
      const tradeID = req.headers.tradeid;
      // addressDict = binanceapi.
      // console.log(req.headers);
      const order = await exchange.fetchDepositAddress(req.query.baseCur);
      // req.log.info(order);
      // console.log(tradeID);
      if (tradeID !== undefined) {
        if (!optimized) {
          writeFile(
            "logs\\getDepositAddress\\getDepositAddress",
            JSON.stringify(order),
            "getDepositAddress"
          );
        }
      } else {
        order.tradeID = tradeID;
        // pino.info(tradeID)

        if (!optimized) {
          writeFile(
            "logs\\getDepositAddress\\getDepositAddress",
            JSON.stringify(order),
            "getDepositAddress"
          );
        }
      }
      res.json(order);
    } else {
      var error = {
        error: true,
        message: "not able to get exchange",
        stack: "-",
      };
      console.log("-------------------------");
      req.log.error(error);
      console.log("-------------------------");
      res.json(error);
    }
  } catch (e) {
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
    // TODO handle the error
    writeFile("errorDepositAddress", e, "errorDepositAddress");
    var error = {
      error: true,
      message: e,
    };
    res.json(error);
    // next(e)
  }
});

app.get("/getWithdrawDepositFee", async (req, res, next) => {
  // var headers = JSON.parse(req.headers.credentials)
  try {
    // addressDict = binanceapi.
    const exchange = req.query.exchange;
    const base_cur = req.query.Currency;
    if (exchange === "binance") {
      console.log("-------------------------------creds-----");
      console.log(req.headers);
      console.log("-----------------------------------------");
      const headers = JSON.parse(req.headers.credentials);
      const withdrawOrDeposit = req.query.withOrDep;
      console.log("parker:");
      console.log(parkersFunction);
      await parkersFunction
        .getWithdrawFeeAndActive(
          exchange,
          base_cur,
          withdrawOrDeposit,
          null,
          headers.apiKey.trim(),
          headers.apiSecret.trim()
        )
        .then(
          function (success) {
            try {
              // console.log("withdraw response:",success);
              const data_fee = parkersFunction.parseData(
                exchange,
                success,
                base_cur
              );

              // pino.info("------result---------------");
              // req.log.info(data_fee);
              // pino.info("----------------------------");
              if (!optimized) {
                writeFile(
                  "logs\\getWithdrawDepositFee\\getWithdrawDepositFee",
                  JSON.stringify(data_fee),
                  "getWithdrawDepositFee"
                );
              }
              res.json(data_fee);
            } catch (e) {
              const error = {
                error: true,
                message: e,
              };

              req.log.error(e);
              res.json(error);
            }
          },
          function (err) {
            req.log.info(err);
            res.json(err);
          }
        );
    } else {
      const withdrawOrDeposit = req.query.withOrDep;
      await parkersFunction
        .getWithdrawFeeAndActive(
          exchange,
          base_cur,
          withdrawOrDeposit,
          null,
          null,
          null
        )
        .then(
          function (success) {
            try {
              // console.log("withdraw response:",success);
              const data_fee = parkersFunction.parseData(
                exchange,
                success,
                base_cur
              );
              // pino.info("------result---------------");
              // req.log.info(data_fee);
              // pino.info("----------------------------");
              if (!optimized) {
                writeFile(
                  "logs\\getWithdrawDepositFee\\getWithdrawDepositFee",
                  JSON.stringify(data_fee),
                  "getWithdrawDepositFee"
                );
              }
              res.json(data_fee);
            } catch (e) {
              const error = {
                error: true,
                message: e,
              };
              console.log("catch error");
              req.log.error(e);
              res.json(error);
            }
          },
          function (err) {
            console.log("big error");
            req.log.info(err);
            res.json(err);
          }
        );
    }

    // res.json(data_fee_res);
  } catch (e) {
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
    writeFile(
      "logs\\errorWithdrawDepositFees\\errorWithdrawDepositFees",
      e,
      "errorWithdrawDepositFees"
    );
    // TODO handle the error
    const error = {
      error: true,
      message: e,
    };
    res.json(error);
    // next(e)
  }
});

// localhost/performWithdraw?exchange={}&symbol={}&amount={}&address={}&paymentID={}
app.get("/performWithdraw", async (req, res, next) => {
  try {
    const headers = JSON.parse(req.headers.credentials);
    const tradeID = req.headers.tradeID;
    let exchange;
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim()
        );
      } else {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          headers.uid.trim()
        );
      }
    } else {
      exchange = await getExchange(
        req.query.exchange,
        headers.apiKey,
        headers.apiSecret,
        headers.password.trim()
      );
    }
    if (exchange !== null && exchange !== undefined) {
      const address = req.headers.address;
      // addressDict = binanceapi.
      const amount = req.headers.amount;
      let order;
      if (headers.paymentID !== undefined) {
        order = await exchange.withdraw(req.query.symbol, amount, address, {
          paymentId: headers.paymentID,
        });
      } else {
        order = await exchange.withdraw(req.query.symbol, amount, address);
      }
      // req.log.info(order);

      if (tradeID !== undefined) {
        order.tradeID = tradeID;
        if (!optimized) {
          writeFile(
            "logs\\performWithdraw\\performWithdraw",
            JSON.stringify(order),
            "performWithdraw"
          );
        }
      } else {
        if (!optimized) {
          writeFile(
            "logs\\perfromWithdraw\\performWithdraw",
            JSON.stringify(order),
            "performWithdraw"
          );
        }
      }
      res.json(order);
    } else {
      var error = {
        error: true,
        message: "not able to get exchange",
        stack: "-",
      };
      console.log("-------------------------");
      req.log.error(error);
      console.log("-------------------------");
      res.json(error);
    }
  } catch (e) {
    console.log("-------------------------");
    req.log.error(e.stack);
    console.log("-------------------------");
    try {
      writeFile(
        "logs\\errorPerformWithdraw\\errorPerformWithdraw",
        e,
        "errorPerformWithdraw"
      );
    } catch (ee) {}
    var error = {
      error: true,
      message: e,
    };
    res.json(error);
    // next(e)
  }
});
// localhost/getMarkets?exchange={}
app.get("/getMarkets", async (req, res, next) => {
  // var headers = JSON.parse(req.headers.credentials, headers.apiKey, headers.apiSecret)
  try {
    const exchange = await getExchange(req.query.exchange);
    if (exchange !== null && exchange !== undefined) {
      const tradeID = req.headers.tradeID;
      const markets = await exchange.fetchMarkets();
      console.log(markets);
      // addressDict = binanceapi.
      // req.log.info(markets);
      if (!optimized) {
        writeFile("logs\\getMarkets\\getMarkets", markets, "getMarkets");
      }
      res.json(markets);
    } else {
      var error = {
        error: true,
        message: "not able to get exchange",
        stack: "-",
      };
      console.log("-------------------------");
      req.log.error(error);
      console.log("-------------------------");
      res.json(error);
    }
  } catch (e) {
    req.log.error(e);

    writeFile("logs\\errorGetMarkets\\errorGetMarkets", e, "errorGetMarkets");
    var error = {
      error: true,
      message: e,
    };
    res.json(error);
    // next(e);
  }
});

// this needs work on
// localhost/testExchange?exchange={}
app.get("/testExchange", async (req, res, next) => {
  var headers = JSON.parse(
    req.headers.credentials,
    headers.apiKey,
    headers.apiSecret
  );
  const result_public = {
    fetchMarkets: false,
    fetchOrderBook: false,
    fetchTicker: false,
    fetchBalance: false,
    successTotal: false,
    error: {
      Exception: null,
    },
    data: {
      markets: null,
      orderbook: null,
      ticker: null,
      balance: null,
    },
    exchange: "string",
  };
  try {
    let exchange;
    if (headers.password === undefined) {
      if (headers.uid === undefined) {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim()
        );
      } else {
        exchange = await getExchange(
          req.query.exchange,
          headers.apiKey.trim(),
          headers.apiSecret.trim(),
          null,
          headers.uid.trim()
        );
      }
    } else {
      exchange = await getExchange(
        req.query.exchange,
        headers.apiKey,
        headers.apiSecret,
        headers.password.trim()
      );
    }
    // var inDetail = req.query.indetail;
    // addressDict = binanceapi
    result_public.exchange = req.query.exchange;

    const markets = await exchange.fetchMarkets();
    const orderbook = await exchange.fetchOpenOrders();
    const ticker = await exchange.fetchTicker();
    const balance = await exchange.fetchBalance();

    if (markets !== null && markets !== undefined) {
      result_public.fetchMarkets = true;
      result_public.data.markets = markets;
    }

    if (orderbook !== null && orderbook !== undefined) {
      result_public.fetchOrderBook = true;
      result_public.data.orderbook = orderbook;
    }

    if (ticker !== null && ticker !== undefined) {
      result_public.fetchTicker = true;
      result_public.data.ticker = ticker;
    }

    if (balance !== null && balance !== undefined) {
      result_public.fetchBalance = true;
      result_public.data.balance = balance;
    }
    // var order = await exchange.withdraw(headers.symbol, headers.amount, headers.address, {"paymentId" : headers.paymentID})

    console.log(result_public);
    res.json(reult_public);
  } catch (e) {
    // TODO handle the error
    console.log(e);
    const error = {
      error: true,
      message: e,
    };
    res.json(error);
    // next(e)
  }
});

function parseBalance(bal, exchange, currency) {
  const bal_ret = [];
  const universal_bal_temp = {
    CurrencyId: "",
    Symbol: "",
    Total: "",
    Available: "",
    Status: "",
  };

  var universal_bal = null;
  var inf = null;

  const info = bal.info;

  switch (exchange) {
    case "binance":
      for (var x in info.balances) {
        var inf = info.balances[x];
        console.log("info: ", inf);
        var universal_bal = {
          CurrencyId: " ",
          Symbol: inf.asset,
          Total: parseFloat(inf.locked) + parseFloat(inf.free),
          Available: inf.free,
          Status: " ",
        };
        bal_ret.push(universal_bal);
      }
      return bal_ret;
    case "hitbtc":
      for (var z in info) {
        var inf = info[z];
        var total = parseFloat(inf.available) + parseFloat(inf.reserved);
        var universal_bal = {
          CurrencyId: "",
          Symbol: inf.currency,
          Total: total,
          Available: inf.available,
          Status: "",
        };
        bal_ret.push(universal_bal);
      }
      return bal_ret;
    case "bittrex":
      for (var x in info) {
        var inf = info[x];
        var universal_bal = {
          CurrencyId: "",
          Symbol: inf.Currency,
          Total: inf.Balance,
          Available: inf.Available,
          Status: "",
        };
        bal_ret.push(universal_bal);
      }

      return bal_ret;
    case "poloniex":
      var curBal = info[currency];
      var total = parseFloat(curBal.available) + parseFloat(curBal.onOrders);
      var universal_bal = {
        CurrencyId: "",
        Symbol: currency,
        Total: total,
        Available: curBal.availble,
        Status: "",
      };
      return universal_bal;
    case "livecoin":
      var arr = info;
      var filtered = arr.filter(function (x) {
        return x.currency === currency;
      });

      var total;
      var available;
      var btcValue;

      for (var y in arr) {
        const selArr = arr[y];
        switch (selArr.type) {
          case "total":
            total = selArr.value;
            break;
          case "available":
            available = selArr.value;
            break;
          case "btcValue":
            btcValue = selArr.value;
            break;
        }
      }

      var universal_bal = {
        CurrencyId: "",
        Symbol: currency,
        Total: total,
        Available: availble,
        Status: "",
      };

      return universal_bal;
    case "kraken":
      var dat = info.data;
      var arr = dat.list;
      var filtered = arr.filter(function (x) {
        return x.currency === currency;
      });

      var available;
      var total;
      var trade;

      for (var y in filtered) {
        var inf = filtered[y];
        switch (inf.type) {
          case "trade":
            trade = inf.balance;
          case "frozen":
            available = inf.frozen;
        }
      }
      total = parseFloat(available) + parseFloat(trade);
      var universal_bal = {
        CurrencyId: "",
        Symbol: currency,
        Total: total,
        Available: availble,
        Status: "",
      };

      return universal_bal;
    case "exmo":
      var bal = info.balances;
      var res = info.reserved;

      var available = bal[currency];
      var reseve = bal[currency];

      var total = parseFloat(available) + parseFloat(reserve);

      var universal_bal = {
        CurrencyId: "",
        Symbol: currency,
        Total: total,
        Available: availble,
        Status: "",
      };

      return universal_bal;

    case "crex24":
      arr = info.Balances;
      for (var x in arr) {
        var obj = arr[x];
        var total = parseFloat(InOrderBalances) + parseFloat(AvailableBalances);
        universal_bal = {
          CurrencyId: "",
          Symbol: currency,
          Total: total,
          Available: obj.AvailableBalances,
          Status: "",
        };
        bal_ret.push(universal_bal);
      }
      return bal_ret;

    case "cobinhood":
      arr = info.result;
      for (var x in arr.balances) {
        var obj = arr[x];
        const ava = parseFloat(obj.total) - parseFloat(obj.on_order);
        var universal_bal = {
          CurrencyId: "",
          Symbol: currency,
          Total: total,
          Available: ava,
          Status: "",
        };
        bal_ret.push(universal_bal);
      }
      return bal_ret;
    case "buda":
      var arr = info.balances;
      for (var x in arr) {
        var obj = arr[x];
        var universal_bal = {
          CurrencyId: "",
          Symbol: currency,
          Total: obj.amount[0],
          Available: obj.available_amount[0],
          Status: "",
        };
        bal_ret.push(universal_bal);
      }
      return bal_ret;
    case "bleutrade":
      var arr = info.result;
      for (var x in arr) {
        var obj = arr[x];
        var universal_bal = {
          CurrencyId: "",
          Symbol: currency,
          Total: obj.Balance,
          Available: obj.Available,
          Status: "",
        };
        bal_ret.push(universal_bal);
      }
      return bal_ret;

    case "bitsane":
      var arr = info.result;
      var obj = arr[currency];
      var universal_bal = {
        CurrencyId: "",
        Symbol: currency,
        Total: obj.total,
        Available: obj.amount,
        Status: "",
      };
      bal_ret.push(universal_bal);
      return bal_ret;

    case "bibox":
      var ob = info.result;
      var arr = ob.assets_list;
      for (var x in arr) {
        var obj = arr[x];
        var total = parseFloat(obj.balance) + parseFloat(obj.freeze);
        var universal_bal = {
          CurrencyId: "",
          Symbol: currency,
          Total: total,
          Available: obj.amount,
          Status: "",
        };
        bal_ret.push(universal_bal);
      }

      return bal_ret;
    case "anybits":
      var ob = info.result;
      var arr = ob.assets_list;
      for (var x in arr) {
        var obj = arr[x];
        var universal_bal = {
          CurrencyId: "",
          Symbol: currency,
          Total: 0,
          Available: obj.amount,
          Status: "",
        };
        bal_ret.push(universal_bal);
      }

      return bal_ret;
  }

  return null;
}

app.get("/checkExchange", async (req, res, next) => {
  try {
    const exchange = await getExchange(req.query.exchange);
    const test = await exchange.fetchMarkets();
    if (test !== undefined) {
      res.json(test);
      // req.log.info(test);
    }
  } catch (e) {
    // console.log("-------------------------")
    req.log.error(e);
    // console.log("-------------------------")
    res.json("[]");
  }
});

function inputPrompt(prompt, answerCallback) {
  inquirer.prompt(prompt).then((answers) => {
    answerCallback(answers);
  });
}

var workers = process.env.WORKERS || require("os").cpus().length / 2;
if (cluster.isMaster) {
  var prompt = [
    {
      type: "list",
      name: "startup configuration",
      message: "do you want cluster enabled (might disbale when debugging): ",
      choices: ["enabled", "disabled"],
    },
    {
      type: "number",
      name: "cores",
      message: "(optinal) enter the number of clusters to run",
    },
  ];

  inputPrompt(prompt, function (info) {
    var check = false;
    console.log(info);
    var numberWorkers = 0;
    if (isNaN(info.cores)) {
      numberWorkers = workers;
    } else {
      numberWorkers = info.cores;
    }
    if (info["startup configuration"] === "enabled") {
      check = true;
    }
    if (check === true) {
      console.log("start cluster with %s workers", numberWorkers);
      for (var i = 0; i < numberWorkers; ++i) {
        var worker = cluster.fork().process;
        console.log("worker %s started.", worker.pid);
      }
      cluster.on("exit", function (worker) {
        console.log("worker %s died. restart...", worker.process.pid);
        cluster.fork();
      });
    } else {
      var worker = cluster.fork().process;
    }
  });
} else {
  app.listen(port, () =>
    console.log(
      `Example app listening on port ${port}!, optimzed is set:` + optimized
    )
  );
  module.exports = app;
}

module.exports = server;

//# sourceMappingURL=all.js.map

//# sourceMappingURL=all.js.map

//# sourceMappingURL=all.js.map

//# sourceMappingURL=all.js.map

//# sourceMappingURL=all.js.map

//# sourceMappingURL=all.js.map
