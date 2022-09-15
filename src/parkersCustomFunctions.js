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
