const ccxt = require("ccxt"),
  fs = require("fs");
(pino_express = require("express-pino-logger")), (pino = require("pino"));
var inquirer = require("inquirer");
const cluster = require("cluster");
var path = require("path");
const express = require("express"),
  app = express();
var rp = require("request-promise");
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");
var compression = require("compression");
const crypto = require("crypto");
rp = require("request-promise");
var ajax = require("node.ajax");
const { parse: parse, stringify: stringify } = require("flatted/cjs"),
  options_swag = { explorer: !0 };
(parkersFunction = {}),
  (parkersFunction.getRequest = function (e, t, i, a = "GET", n, o) {
    var r = { uri: e, json: !0 };
    try {
      rp(r)
        .then(function (e) {
          t(e);
        })
        .catch(function (e) {
          loggerPino.error(e), i(e);
        });
    } catch (e) {
      loggerPino.error(e), i(e);
    }
  }),
  (parkersFunction.getRequestWithSignature = function (
    e,
    t,
    i,
    a,
    n,
    o = "GET",
    r,
    c,
    s
  ) {
    var l = {
      uri:
        e +
        "?" +
        t +
        "&signature=" +
        crypto.createHmac("sha256", s).update(t).digest("hex"),
      headers: { "X-MBX-APIKEY": n },
      json: !0,
    };
    try {
      rp(l)
        .then(function (e) {
          i(e);
        })
        .catch(function (e) {
          loggerPino.error(e), a(e);
        });
    } catch (e) {
      loggerPino.error(e), a(e);
    }
  }),
  (parkersFunction.getIsCoinPaymentID = function (e, t) {
    this.getRequest(
      "https://api.hitbtc.com/api/2/public/currency",
      function (t) {
        loggerPino.info(t), e(t);
      },
      function (e) {
        loggerPino.info(e), t(e);
      }
    );
  }),
  (parkersFunction.getWithdrawFeeAndActive = function (
    e,
    t = null,
    i = null,
    a = null,
    n = null,
    o = null
  ) {
    switch (e) {
      case "binance":
        return (r = new Promise(function (e, t) {
          var i = new Date().getTime();
          parkersFunction.getRequestWithSignature(
            "https://api.binance.com/wapi/v3/assetDetail.html",
            "timestamp=" + i + "&recvWindow=5000",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            },
            n,
            "GET",
            null,
            null,
            o
          );
        }));
      case "bittrex":
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://www.bittrex.com/api/v1.1/public/getCurrencies",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
      case "hitbtc":
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://api.hitbtc.com/api/2/public/currency",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
      case "anybits":
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://www.anybits.com/api/public/assets/currencies",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
      case "bitsane":
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://bitsane.com/api/public/assets/currencies",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
      case "bleutrade":
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://www.bleutrade.com/api/v2/public/getcurrencies",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
      case "buda":
        return (r = new Promise(function (e, a) {
          parkersFunction.getRequest(
            "https://www.buda.com/api/v2/currencies/" + t + "/fees/" + i,
            function (t) {
              e(t);
            },
            function (e) {
              a(e);
            }
          );
        }));
      case "cobinhood":
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://api.cobinhood.com/v1/market/currencies",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
      case "crex24":
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://api.crex24.com/CryptoExchangeService/BotPublic/ReturnCurrencies",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
      case "kraken":
        return (r = new Promise(function (e, i) {
          parkersFunction.getRequest(
            "https://api.kraken.com/0/private/WithdrawInfo?asset=" +
              t +
              "&key=" +
              key +
              "&amount=" +
              a,
            function (t) {
              e(t);
            },
            function (e) {
              i(e);
            }
          );
        }));
      case "livecoin":
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://api.livecoin.net/info/coininfo",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
      case "cryptopia":
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://www.cryptopia.co.nz/api/GetCurrencies",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
      case "poloniex":
        var r;
        return (r = new Promise(function (e, t) {
          parkersFunction.getRequest(
            "https://poloniex.com/public?command=returnCurrencies",
            function (t) {
              e(t);
            },
            function (e) {
              t(e);
            }
          );
        }));
    }
    return r;
  }),
  (parkersFunction.parseData = function (e, t, i) {
    switch (e) {
      case "bittrex":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: "string",
                symbol: "string",
                paymentID: "string",
                isActive: 0,
              },
              a = e.result,
              n = a.filter(function (e) {
                return e.Currency == t;
              });
            console.log("--------------------------------");
            var o = n[0];
            return (
              console.log(o),
              (i.withdraw_fee = o.TxFee),
              (i.isActive = o.IsActive),
              (i.symbol = t),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "hitbtc":
        return (function (e, t) {
          try {
            var i = {
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
            console.log("CURRENCY:" + t);
            var a = e.filter(function (e) {
                return e.id == t;
              }),
              n = a[0];
            return (
              console.log(n),
              (i.symbol = n.id),
              (i.withdraw_fee = n.payoutFee),
              console.log(
                "------------------------------------------------------"
              ),
              console.log("payout:" + n.payoutEnabled),
              console.log("payin:" + n.payinEnabled),
              console.log("delisted:" + n.delisted),
              console.log("payout var type:" + typeof n.payoutEnabled),
              console.log(
                "-------------------------------------------------------"
              ),
              0 == n.payinEnabled || 0 == n.payoutEnabled || 1 == n.delisted
                ? (i.isActive = !1)
                : (i.isActive = !0),
              1 == n.payoutIsPaymentId && (i.paymentID = n.payinPaymentId),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "anybits":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: "string",
                symbol: "string",
                paymentID: "string",
                isActive: 0,
              },
              a = e[t];
            return (
              (i.deposit_fee = a.deposit_fee),
              (i.withdraw_fee = a.withdrawal_fee),
              0 == a.deposit || 0 == a.withdrawal
                ? (i.isActive = !1)
                : (i.isActive = !0),
              (i.symbol = t),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "bitsane":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: "string",
                symbol: "string",
                paymentID: "string",
                isActive: 0,
              },
              a = e[t];
            return (
              console.log(a),
              (i.deposit_fee = a.deposit_fee),
              (i.withdraw_fee = a.withdrawal_fee),
              0 == a.deposit || 0 == a.withdrawal
                ? (i.isActive = !1)
                : (i.isActive = !0),
              (i.symbol = t),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "bleutrade":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: "string",
                symbol: "string",
                paymentID: "string",
                isActive: 0,
              },
              a = e.result,
              n = a.filter(function (e) {
                return e.Currency == t;
              }),
              o = n[0];
            return (
              (i.withdraw_fee = o.TxFee),
              (i.isActive = o.isActive),
              (i.symbol = t),
              i
            );
          } catch (e) {
            return loggerpino.error(e), null;
          }
        })(t, i);
      case "buda":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: "string",
                symbol: "string",
                paymentID: "string",
                isActive: !0,
              },
              a = e.fee;
            return (
              "withdrawal" == a.name
                ? (i.withdraw_fee = a.base[0])
                : (i.deposit_fee = a.base[0]),
              (i.symbol = t),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "cobinhood":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: "string",
                symbol: "string",
                paymentID: "string",
                isActive: !0,
              },
              a = e.result.currencies,
              n = a.filter(function (e) {
                return e.currency == t;
              }),
              o = n[0];
            return (
              (i.symbol = t),
              (i.deposit_fee = o.deposit_fee),
              (i.withdraw_fee = o.withdrawal_fee),
              (i.withdraw_min = o.min_withdrawal),
              o.deposit_frozen || o.withdrawal_frozen
                ? (i.isActive = !1)
                : (i.isActive = !0),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "crex24":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: 0,
                symbol: "string",
                isActive: 0,
              },
              a = e.Currencies,
              n = a.filter(function (e) {
                return e.ShortName == t;
              }),
              o = n[0];
            return (
              (i.symbol = o.ShortName),
              o.Disabled || o.Delisted || o.Frozen
                ? (i.isActive = !1)
                : (i.isActive = !0),
              (i.withdraw_fee = o.TxFee),
              (i.withdraw_max = o.MaximumWithdraw),
              (i.withdraw_min = o.MinimalWithdraw),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "kraken":
        return null;
      case "binance":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: "string",
                symbol: "string",
                paymentID: "string",
                isActive: !0,
              },
              a = e.assetDetail,
              n = a[t];
            return (
              (i.minWithdrawAmount = n.minWithdrawAmount),
              (i.deposit_frozen = n.depositStatus),
              (i.withdraw_fee = n.withdrawFee.toString()),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "livecoin":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: 0,
                symbol: "string",
                isActive: 0,
              },
              a = e.info,
              n = a.filter(function (e) {
                return e.symbol == t;
              }),
              o = n[0];
            i.symbol = o.symbol;
            var r = o.walletStatus,
              c = !0;
            switch (r) {
              case "delayed":
              case "blocked":
              case "blocked_long":
              case "down":
              case "delisted":
              case "closed_cashin":
              case "closed_cashout":
                c = !1;
            }
            return (
              (i.isActive = c),
              (i.withdraw_fee = o.withdrawFee),
              (i.deposit_min = o.minDepositAmount),
              (i.withdraw_min = o.minWithdrawAmount),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "cryptopia":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: "string",
                symbol: "string",
                paymentID: "string",
                isActive: !0,
              },
              a = e.Data,
              n = a.filter(function (e) {
                return e.Symbol == t;
              }),
              o = n[0];
            return (
              (i.withdraw_fee = o.WithdrawFee),
              (i.withdraw_max = o.MaxWithdraw),
              (i.withdraw_min = o.MinWithdraw),
              "OK" != o.Status ? (i.isActive = !1) : (i.isActive = !0),
              (i.symbol = t),
              i
            );
          } catch (e) {
            return loggerPino.error(e), null;
          }
        })(t, i);
      case "poloniex":
        return (function (e, t) {
          try {
            var i = {
                withdraw_min: 0,
                withdraw_max: 0,
                deposit_min: 0,
                deposit_max: 0,
                deposit_fee: 0,
                withdraw_fee: "string",
                symbol: "string",
                paymentID: "string",
                isActive: !0,
              },
              a = e[t];
            return (
              (i.withdraw_fee = a.txFee),
              1 == a.disabled ? (i.isActive = !1) : (i.isActive = !0),
              (i.symbol = t),
              i
            );
          } catch (e) {
            loggerPino.error(e);
          }
        })(t, i);
    }
  }),
  (module.exports = parkersFunction),
  (CryptoUtil = {}),
  (CryptoUtil.getCoinStatAvgPrices = function (e, t, i, a) {
    parkersFunction.getRequest(
      "https://api.coinstats.app/public/v1/coins?skip=" + e + "&limit=" + t,
      function (e) {
        i(e);
      },
      function (e) {
        loggerPino.info(e), a(e);
      },
      "GET",
      null,
      null
    );
  }),
  (CryptoUtil.getMarketsOfCoin = function (e, t, i) {
    parkersFunction.getRequest(
      "https://api.coinstats.app/public/v1/markets?coinId=" + e,
      t,
      i,
      "GET",
      null,
      null
    );
  }),
  (CryptoUtil.getNews = function (e, t, i, a) {
    parkersFunction.getRequest(
      "https://api.coinstats.app/public/v1/news?skip=" + e + "&limit=" + t,
      i,
      a,
      "GET",
      null,
      null
    );
  }),
  (CryptoUtil.getFiatCurrencies = function (e, t) {
    parkersFunction.getRequest(
      "https://api.coinstats.app/public/v1/fiats",
      e,
      t,
      "GET",
      null,
      null
    );
  }),
  (CryptoUtil.betterGetRequest = function (e, t, i, a) {
    parkersFunction.getRequest(
      e,
      function (e) {
        return e;
      },
      function (e) {
        return e;
      },
      t,
      i,
      a
    );
  }),
  (CryptoUtil.getCryptoPanicArticles = function (e, t, i, a) {
    parkersFunction.getRequest(
      "https://cryptopanic.com/api/v1/posts/?auth_token=" +
        e +
        "&currencies=" +
        t,
      i,
      a,
      "GET",
      null,
      null
    );
  }),
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options_swag)
  ),
  app.use(compression()),
  app.use(express.static(path.join(__dirname, "public")));
const loggerPino = pino({ prettyPrint: { colorize: !0 } }),
  loggerPinoExpress = pino_express({ prettyPrint: { colorize: !0 } }),
  port = 3e3;
app.use(loggerPinoExpress);
const optimized = !0,
  setEnableRateLimit = !0,
  error = {
    url: "str",
    headers: {},
    exception: null,
    exchange: "str",
    endpoint: "str",
  };
server = {};
const timeoutConst = 9e4;
async function getExchange(e, t, i, a, n, o) {
  try {
    switch ((loggerPino.info("The exchange selected is " + e), e)) {
      case "binance":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.binance({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
              options: { createMarketBuyOrderRequiresPrice: o },
            })
          : await new ccxt.binance({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "hitbtc":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.hitbtc({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.hitbtc({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bittrex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bittrex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
              options: { createMarketBuyOrderRequiresPrice: o },
            })
          : await new ccxt.bittrex({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitfinex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitfinex2({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitfinex2({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "kraken":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.kraken({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.kraken({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "theocean":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.theocean({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.theocean({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "upbit":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.upbit({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.upbit({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "acx":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.acx({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.acx({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "cex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.cex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.cex({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitstamp":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitstamp({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              uid: n,
              timeout: timeoutConst,
            })
          : await new ccxt.bitstamp({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bithumb":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bithumb({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bithumb({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "coinbase":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinbase({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.coinbase({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "coinbasepro":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinbasepro({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              password: a,
              timeout: timeoutConst,
            })
          : await new ccxt.coinbasepro({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bcex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bcex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bcex({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "_1btcxe":
        return void 0 !== t && void 0 !== i
          ? await new ccxt._1btcxe({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt._1btcxe({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "anxpro":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.anxpro({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.anxpro({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bibox":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bibox({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bibox({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bigone":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bigone({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bigone({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bit2c":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bit2c({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bit2c({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitbank":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitbank({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitbank({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitbay":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitbay({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitbay({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitflyer":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitflyer({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitflyer({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitforex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitforex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitforex({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitkk":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitkk({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitkk({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitlish":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitlish({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitlish({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitmarket":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitmarket({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitmarket({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitmex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitmex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitmex({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitso":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitso({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitso({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bitz":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bitz({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bitz({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bl3p":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bl3p({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bl3p({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "bleutrade":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bleutrade({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.bleutrade({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "braziliex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.braziliex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.braziliex({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "btcalpha":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.btcalpha({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.btcalpha({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "btcbox":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.btcbox({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.btcbox({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "btcchina":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.btcchina({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.btcchina({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "btcmarkets":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.btcmarkets({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.btcmarkets({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "btctradeua":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.btctradeua({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.btctradeua({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "btcturk":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.btcturk({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.btcturk({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "buda":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.buda({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.buda({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "chilebit":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.chiebit({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.chilebit({
              enableRateLimit: setEnableRateLimit,
              timeout: timeoutConst,
            });
      case "cobinhood":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.cobinhood({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: timeoutConst,
            })
          : await new ccxt.cobinhood({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coinbaseprime":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinbaseprime({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coinbaseprime({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coincheck":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coincheck({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coincheck({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coinegg":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinegg({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coinegg({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coinex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coinex({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coinfalcon":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinfalcon({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coinfalcon({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coinfloor":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinfloor({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coinfloor({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coingi":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coingi({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coingi({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coinmarketcap":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinmarketcap({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coinmarketcap({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coinmate":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinmate({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coinmate({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coinone":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinone({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coinone({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coinspot":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coinspot({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coinspot({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "cointiger":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.cointiger({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.cointiger({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "coolcoin":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coolcoin({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.coolcoin({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "crex24":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.crex24({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 6e4,
            })
          : await new ccxt.crex24({
              enableRateLimit: setEnableRateLimit,
              timeout: 6e4,
            });
      case "dsx":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.dsx({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.dsx({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "exmo":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.exmo({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.exmo({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "exx":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.exx({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.exx({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "fcoin":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.fcoin({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.fcoin({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "flowbtc":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.flowbtc({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.flowbtc({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "foxbit":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.foxbit({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.foxbit({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "fybse":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.fybse({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.fybse({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "fybsg":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.fybsg({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.fybsg({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "gateio":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.gateio({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.gateio({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "gemini":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.gemini({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.gemini({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "hadax":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.hadax({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.hadax({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "huobipro":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.huobipro({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.huobipro({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "ice3x":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.ice3x({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.ice3x({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "independentreserve":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.independentreserve({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.independentreserve({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "indodax":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.indodax({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.indodax({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "itbit":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.itbit({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.itbit({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "kkex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.kkex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.kkex({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "kucoin":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.kucoin({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.kucoin({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "kuna":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.kuna({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.kuna({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "lakebtc":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.lakebtc({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.lakebtc({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "liqui":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.liqui({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.liqui({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "livecoin":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.livecoin({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.livecoin({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "luno":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.luno({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.luno({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "lykke":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.lykke({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.lykke({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "mercado":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.mercado({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.mercado({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "mixcoins":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.mixcoins({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.mixcoins({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "okcoinusd":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.okcoinusd({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.okcoinusd({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "okex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.okex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.okex({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "paymium":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.paymium({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.paymium({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "poloniex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.poloniex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
              nonce: function () {
                return new Date().getTime();
              },
            })
          : await new ccxt.poloniex({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
              nonce: function () {
                return new Date().getTime();
              },
            });
      case "quoinex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.quoinex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.quoinex({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "rightbtc":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.rightbtc({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.rightbtc({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "southxchange":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.southxchange({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.southxchange({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "surbitcoin":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.surbitcoin({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.surbitcoin({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "therock":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.therock({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.therock({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "tidebit":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.tidebit({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.tidebit({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "tidex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.tidex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.tidex({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "vaultoro":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.vaultoro({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.vaultoro({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "vbtc":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.vbtc({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.vbtc({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "xbtce":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.xbtce({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.xbtce({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "yobit":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.yobit({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.yobit({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "zaif":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.zaif({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.zaif({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "zb":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.zb({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.zb({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "whitebit":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.whitebit({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.whitebit({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "topq":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.topq({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.topq({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "timex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.timex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.timex({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "stex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.stex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.stex({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "stronghold":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.stronghold({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.stronghold({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "oceanex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.oceanex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.oceanex({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "lbank":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.lbank({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.lbank({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "latoken":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.latoken({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.latoken({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "hollaex":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.hollaex({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.hollaex({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "fcoinjp":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.fcoinjp({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.fcoinjp({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "deribit":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.deribit({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.deribit({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "coss":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.coss({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.coss({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "bytetrade":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bytetrade({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.bytetrade({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      case "bybit":
        return void 0 !== t && void 0 !== i
          ? await new ccxt.bybit({
              enableRateLimit: setEnableRateLimit,
              apiKey: t,
              secret: i,
              timeout: 4e4,
            })
          : await new ccxt.bybit({
              enableRateLimit: setEnableRateLimit,
              timeout: 4e4,
            });
      default:
        return null;
    }
  } catch (e) {
    return console.log(e.stack), null;
  }
}
function getCurrentDateTimeString() {
  try {
    let e = new Date(),
      t = e.getDate(),
      i = e.getMonth() + 1;
    const a = e.getFullYear();
    t < 10 && (t = "0" + t), i < 10 && (i = "0" + i);
    const n = e.getTime();
    return (e = i + "_" + t + "_" + a + "_" + n);
  } catch (e) {
    return console.log(e), "errorGettingDate";
  }
}
function writeFile(e, t, i) {
  try {
    fs.existsSync("logs") || fs.mkdirSync("logs"),
      fs.existsSync("logs\\" + i) || fs.mkdirSync("logs\\" + i);
    var a = getCurrentDateTimeString();
    (e = e + a + ".txt"),
      fs.writeFile(e, t, function (e) {
        if (e) return console.log(e);
        loggerPino.error("LOGGED CALL FOR RECORDS");
      });
  } catch (e) {
    console.log(e);
  }
  (e = e + (a = getCurrentDateTimeString()) + ".txt"),
    fs.writeFile(e, t, function (e) {
      if (e) return console.log(e);
      loggerPino.info("LOGGED CALL FOR RECORDS");
    });
}
function parseBalance(e, t, i) {
  const a = [];
  var n = null,
    o = null;
  const r = e.info;
  switch (t) {
    case "binance":
      for (var c in r.balances) {
        o = r.balances[c];
        console.log("info: ", o);
        n = {
          CurrencyId: " ",
          Symbol: o.asset,
          Total: parseFloat(o.locked) + parseFloat(o.free),
          Available: o.free,
          Status: " ",
        };
        a.push(n);
      }
      return a;
    case "hitbtc":
      for (var s in r) {
        o = r[s];
        var l = parseFloat(o.available) + parseFloat(o.reserved);
        n = {
          CurrencyId: "",
          Symbol: o.currency,
          Total: l,
          Available: o.available,
          Status: "",
        };
        a.push(n);
      }
      return a;
    case "bittrex":
      for (var c in r) {
        n = {
          CurrencyId: "",
          Symbol: (o = r[c]).Currency,
          Total: o.Balance,
          Available: o.Available,
          Status: "",
        };
        a.push(n);
      }
      return a;
    case "poloniex":
      var m = r[i];
      l = parseFloat(m.available) + parseFloat(m.onOrders);
      return (n = {
        CurrencyId: "",
        Symbol: i,
        Total: l,
        Available: m.availble,
        Status: "",
      });
    case "livecoin":
      var u = (g = r).filter(function (e) {
        return e.currency === i;
      });
      for (var b in g) {
        const e = g[b];
        switch (e.type) {
          case "total":
            l = e.value;
            break;
          case "available":
            d = e.value;
            break;
          case "btcValue":
            e.value;
        }
      }
      return (n = {
        CurrencyId: "",
        Symbol: i,
        Total: l,
        Available: availble,
        Status: "",
      });
    case "kraken":
      var w;
      u = (g = r.data.list).filter(function (e) {
        return e.currency === i;
      });
      for (var b in u) {
        switch ((o = u[b]).type) {
          case "trade":
            w = o.balance;
          case "frozen":
            d = o.frozen;
        }
      }
      return (
        (l = parseFloat(d) + parseFloat(w)),
        (n = {
          CurrencyId: "",
          Symbol: i,
          Total: l,
          Available: availble,
          Status: "",
        })
      );
    case "exmo":
      (e = r.balances), r.reserved;
      var d = e[i];
      e[i], (l = parseFloat(d) + parseFloat(reserve));
      return (n = {
        CurrencyId: "",
        Symbol: i,
        Total: l,
        Available: availble,
        Status: "",
      });
    case "crex24":
      for (var c in (g = r.Balances)) {
        var p = g[c];
        l = parseFloat(InOrderBalances) + parseFloat(AvailableBalances);
        (n = {
          CurrencyId: "",
          Symbol: i,
          Total: l,
          Available: p.AvailableBalances,
          Status: "",
        }),
          a.push(n);
      }
      return a;
    case "cobinhood":
      for (var c in (g = r.result).balances) {
        p = g[c];
        const e = parseFloat(p.total) - parseFloat(p.on_order);
        n = { CurrencyId: "", Symbol: i, Total: l, Available: e, Status: "" };
        a.push(n);
      }
      return a;
    case "buda":
      var g = r.balances;
      for (var c in g) {
        (p = g[c]),
          (n = {
            CurrencyId: "",
            Symbol: i,
            Total: p.amount[0],
            Available: p.available_amount[0],
            Status: "",
          });
        a.push(n);
      }
      return a;
    case "bleutrade":
      g = r.result;
      for (var c in g) {
        (p = g[c]),
          (n = {
            CurrencyId: "",
            Symbol: i,
            Total: p.Balance,
            Available: p.Available,
            Status: "",
          });
        a.push(n);
      }
      return a;
    case "bitsane":
      (p = (g = r.result)[i]),
        (n = {
          CurrencyId: "",
          Symbol: i,
          Total: p.total,
          Available: p.amount,
          Status: "",
        });
      return a.push(n), a;
    case "bibox":
      g = r.result.assets_list;
      for (var c in g) {
        (p = g[c]),
          (l = parseFloat(p.balance) + parseFloat(p.freeze)),
          (n = {
            CurrencyId: "",
            Symbol: i,
            Total: l,
            Available: p.amount,
            Status: "",
          });
        a.push(n);
      }
      return a;
    case "anybits":
      g = r.result.assets_list;
      for (var c in g) {
        (p = g[c]),
          (n = {
            CurrencyId: "",
            Symbol: i,
            Total: 0,
            Available: p.amount,
            Status: "",
          });
        a.push(n);
      }
      return a;
  }
  return null;
}
function inputPrompt(e, t) {
  inquirer.prompt(e).then((e) => {
    t(e);
  });
}
app.get("/describe", async (e, t) => {
  try {
    const i = (await getExchange(e.query.exchange)).describe();
    t.json(i);
  } catch (i) {
    console.log("-------------------------"),
      e.log.error(i.stack),
      console.log("-------------------------");
    const a = { error: !0, message: i, stack: i.stack };
    t.json(a);
  }
}),
  app.get("/getOrderBook", async (e, t) => {
    try {
      const i = await getExchange(e.query.exchange);
      i.enableRateLimit = !0;
      const a = e.query.symbol,
        n = await i.fetchOrderBook(a);
      t.json(n);
    } catch (i) {
      const a = { error: !0, message: i, stack: i.stack };
      t.json(a),
        console.log("-------------------------"),
        e.log.error(i.stack),
        console.log("-------------------------");
    }
  }),
  app.get("/ListOfExchanges", async (e, t) => {
    t.json([
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
    ]);
  }),
  app.get("/transferMainToTrade", async (e, t) => {
    try {
      const a = JSON.parse(e.headers.credentials),
        n = e.query.symbol,
        o = e.headers.amount,
        r = a.apiKey,
        c = a.apiSecret,
        s = await getExchange(e.query.exchange, r.trim(), c.trim());
      if (((s.enableRateLimit = !0), null !== s || void 0 !== s))
        s.private_post_account_transfer({
          currency: n,
          amount: parseFloat(o),
          type: "bankToExchange",
        }),
          t.json({ success: !0 });
      else {
        var i = { error: !0, message: "could not get exchange", stack: "-" };
        console.log("-------------------------"),
          e.log.error("could not get exchange"),
          console.log("-------------------------"),
          t.json(i);
      }
    } catch (a) {
      (i = { error: !0, message: a, stack: a.stack }),
        t.json(i),
        console.log("-------------------------"),
        e.log.error(a.stack),
        console.log("-------------------------");
    }
  }),
  app.get("/transferTradeToMain", async (e, t) => {
    try {
      const a = JSON.parse(e.headers.credentials),
        n = e.query.symbol,
        o = e.headers.amount,
        r = a.apiKey,
        c = a.apiSecret,
        s = await getExchange(e.query.exchange, r.trim(), c.trim());
      if (((s.enableRateLimit = !0), null != s))
        s.private_post_account_transfer({
          currency: n,
          amount: parseFloat(o),
          type: "exchangeToBank",
        }),
          t.json({ success: !0 });
      else {
        var i = { error: !0, message: "not able to get exchange", stack: "-" };
        console.log("-------------------------"),
          e.log.error(i),
          console.log("-------------------------"),
          t.json(i);
      }
    } catch (a) {
      (i = { error: !0, message: a, stack: a.stack }),
        console.log("-------------------------"),
        e.log.error(a.stack),
        console.log("-------------------------"),
        e.log.info(a),
        t.json(i);
    }
  }),
  app.get("/balance", async (e, t) => {
    try {
      const i = JSON.parse(e.headers.credentials),
        a = i.apiKey,
        n = i.apiSecret,
        o = e.query.type,
        r = e.query.currency;
      let c;
      console.log(e.query.exchange),
        console.log(i),
        (c =
          void 0 === i.password
            ? void 0 === i.uid
              ? await getExchange(e.query.exchange, a.trim(), n.trim())
              : await getExchange(
                  e.query.exchange,
                  a.trim(),
                  n.trim(),
                  null,
                  i.uid.trim()
                )
            : await getExchange(
                e.query.exchange,
                a.trim(),
                n.trim(),
                i.password.trim()
              ));
      let s = null;
      (s =
        void 0 !== o
          ? await c.fetchBalance({ type: o })
          : await c.fetchBalance()),
        console.log("balance: ", s);
      const l = parseBalance(s, e.query.exchange, r);
      0, t.json(l);
    } catch (i) {
      console.log("-------------------------"),
        e.log.error(i.stack),
        console.log("-------------------------"),
        writeFile("logs\\errorBalance\\errorBalance.txt", i);
      const a = { error: !0, message: i, stack: i.stack };
      t.json(a);
    }
  }),
  app.get("/cancelOrder", async (e, t) => {
    try {
      const i = JSON.parse(e.headers.credentials),
        a = e.query.id;
      let n;
      (n =
        void 0 === i.password
          ? void 0 === i.uid
            ? await getExchange(
                e.query.exchange,
                i.apiKey.trim(),
                i.apiSecret.trim()
              )
            : await getExchange(
                e.query.exchange,
                i.apiKey.trim(),
                i.apiSecret.trim(),
                null,
                i.uid.trim()
              )
          : await getExchange(
              e.query.exchange,
              i.apiKey.trim(),
              i.apiSecret.trim(),
              i.password.trim()
            )).enableRateLimit = !0;
      const o = await n.cancelOrder(a);
      t.json(o);
    } catch (i) {
      e.log.error(i),
        writeFile(
          "logs\\errorCancelOrder\\errorCancelOrder",
          i,
          "errorCancelOrder"
        );
      const a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/withdrawDepositHistory", async (e, t) => {
    try {
      const i = JSON.parse(e.headers.credentials),
        a = e.query.exchange;
      let n;
      (n =
        void 0 === i.password
          ? void 0 === i.uid
            ? await getExchange(a, i.apiKey.trim(), i.apiSecret.trim())
            : await getExchange(
                a,
                i.apiKey.trim(),
                i.apiSecret.trim(),
                null,
                i.uid.trim()
              )
          : await getExchange(
              a,
              i.apiKey,
              i.apiSecret,
              i.password.trim()
            )).enableRateLimit = !0;
      const o = {
        withdraw: await n.fetchWithdrawals(),
        deposit: await n.fetchDeposits(),
      };
      t.json(o);
    } catch (i) {
      e.log.error(i),
        writeFile(
          "logs\\errorWithdrawDepositHist\\errorWithdrawDepositHist",
          i,
          "errorWithdrawDepositHist"
        );
      const a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/order", async (e, t) => {
    try {
      const n = JSON.parse(e.headers.credentials),
        o = (e.headers.tradeID, e.query.setMarketPrice);
      var i = !1;
      let r;
      if (
        ("true" === o && (i = !0),
        ((r =
          void 0 === n.password
            ? void 0 === n.uid
              ? await getExchange(
                  e.query.exchange,
                  n.apiKey.trim(),
                  n.apiSecret.trim(),
                  null,
                  null,
                  i
                )
              : await getExchange(
                  e.query.exchange,
                  n.apiKey.trim(),
                  n.apiSecret.trim(),
                  null,
                  n.uid.trim(),
                  i
                )
            : await getExchange(
                e.query.exchange,
                n.apiKey,
                n.apiSecret,
                n.password.trim(),
                null,
                i
              )).enableRateLimit = !0),
        null !== r || void 0 !== r)
      ) {
        const a = e.headers.quantity,
          n = e.headers.price,
          o = e.headers.timeInForce;
        let c;
        (c =
          null === o
            ? (!0 === i && e.query.type,
              await r.createOrder(
                e.query.quoteCur + "/" + e.query.baseCur,
                e.query.type,
                e.query.side,
                a,
                n
              ))
            : await r.createOrder(
                e.query.quoteCur + "/" + e.query.baseCur,
                e.query.type,
                e.query.side,
                a,
                n,
                { timeInForce: o }
              )),
          t.json(c);
      } else {
        var a = { error: !0, message: "not able to get exchange", stack: "-" };
        console.log("-------------------------"),
          e.log.error(a),
          console.log("-------------------------"),
          t.json(a);
      }
    } catch (i) {
      console.log("-------------------------"),
        e.log.error(i.stack),
        console.log("-------------------------"),
        writeFile("logs\\errorOrder\\errorOrder", i, "errorOrder"),
        (a = { error: !0, message: i, stack: i.stack }),
        t.json(a);
    }
  }),
  app.get("/getOpenOrders", async (e, t) => {
    try {
      const a = JSON.parse(e.headers.credentials);
      let n;
      if (
        null !==
          (n =
            void 0 === a.password
              ? void 0 === a.uid
                ? await getExchange(
                    e.query.exchange,
                    a.apiKey.trim(),
                    a.apiSecret.trim()
                  )
                : await getExchange(
                    e.query.exchange,
                    a.apiKey.trim(),
                    a.apiSecret.trim(),
                    null,
                    a.uid.trim()
                  )
              : await getExchange(
                  e.query.exchange,
                  a.apiKey,
                  a.apiSecret,
                  a.password.trim()
                )) ||
        void 0 !== n
      ) {
        e.headers.tradeID;
        const i = e.query.symbolBase,
          a = e.query.symbolQuote;
        console.log(n);
        n.milliseconds();
        let o;
        (o =
          void 0 === i && void 0 === a
            ? await n.fetchOpenOrders()
            : await n.fetchOpenOrders(i + "/" + a)),
          t.json(o),
          e.log.info("has fetchOpenOrders: " + n.has.fetchOpenOrders);
      } else {
        var i = { error: !0, message: "not able to get exchange", stack: "-" };
        console.log("-------------------------"),
          e.log.error(i),
          console.log("-------------------------"),
          t.json(i);
      }
    } catch (a) {
      e.log.error(a),
        writeFile(
          "logs\\errorOpenOrders\\errorOpenOrders",
          a,
          "errorOpenOrders"
        ),
        (i = { error: !0, message: a, stack: a.stack }),
        t.json(i);
    }
  }),
  app.get("/getTickerData", async (e, t) => {
    try {
      const a = await getExchange(e.query.exchange);
      if (null !== a || void 0 !== a) {
        const i = e.query.baseCur,
          n = e.query.quoteCur;
        console.log("base currency: " + i), console.log("quote currency:" + n);
        let o = null;
        (o = await a.fetchTicker(i + "/" + n)), t.json(o);
      } else {
        var i = { error: !0, message: "not able to get exchange", stack: "-" };
        console.log("-------------------------"),
          e.log.error(i),
          console.log("-------------------------"),
          t.json(i);
      }
    } catch (a) {
      e.log.error(a),
        writeFile(
          "logs\\errorTickerData\\errorTickerData",
          a,
          "errorTickerData"
        ),
        (i = { error: !0, message: a, stack: a.stack }),
        t.json(i);
    }
  }),
  app.get("/getOrders", async (e, t) => {
    try {
      const i = JSON.parse(e.headers.credentials);
      let a;
      a =
        void 0 === i.password
          ? void 0 === i.uid
            ? await getExchange(
                e.query.exchange,
                i.apiKey.trim(),
                i.apiSecret.trim()
              )
            : await getExchange(
                e.query.exchange,
                i.apiKey.trim(),
                i.apiSecret.trim(),
                null,
                i.uid.trim()
              )
          : await getExchange(
              e.query.exchange,
              i.apiKey,
              i.apiSecret,
              i.password.trim()
            );
      const n = await a.fetchOrders(i.symbol.replace("-", "/"));
      t.json(n);
    } catch (i) {
      console.log("-------------------------"),
        e.log.error(i.stack),
        console.log("-------------------------");
      const a = { error: !0, message: i, stack: i.stack };
      t.json(a);
    }
  }),
  app.get("/getOHLCV", async (e, t) => {
    try {
      const n = e.query.baseCur,
        o = e.query.quoteCur,
        r = e.query.timeframe,
        c = await getExchange(e.query.exchange),
        s = await c.fetchOHLCV(n + "/" + o, r),
        l = {
          timestamp: [],
          openPrice: [],
          highPrice: [],
          lowPrice: [],
          closePrice: [],
          volume: [],
        };
      for (var i in s) {
        const e = s[i];
        for (var a in e) {
          const t = e[a];
          switch (a) {
            case "0":
              l.timestamp.push(t);
              break;
            case "1":
              l.openPrice.push(t);
              break;
            case "2":
              l.highPrice.push(t);
              break;
            case "3":
              l.lowPrice.push(t);
              break;
            case "4":
              l.closePrice.push(t);
              break;
            case "5":
              l.volume.push(t);
          }
        }
      }
      t.json(l);
    } catch (i) {
      e.log.error(i);
      const a = { error: !0, message: i };
      t.json(a);
    }
  }),
  process.on("uncaughtException", function (e) {
    try {
      console.log("//////////////////////////////////////////////////////"),
        console.log(new Date().toUTCString() + " uncaught Exception: "),
        console.log(e),
        fs.writeSync(1, `Caught exception: ${e}\n`),
        console.log("//////////////////////////////////////////////////////"),
        writeFile("logs\\crashLog\\crashLog", e, "crashLog"),
        process.exit(1);
    } catch (e) {
      process.exit(1);
    }
  }),
  process.on("warning", (e) => {
    console.warn(e.name), console.warn(e.message), console.warn(e.stack);
  }),
  process.on("unhandledRejection", (e, t) => {
    console.log("Unhandled Rejection at:", t, "reason:", e);
  }),
  app.get("/getMinMaxTradeAmount", async (e, t) => {
    try {
      const a = e.query.baseCur,
        n = e.query.quoteCur,
        o = e.query.exchange,
        r = await getExchange(o),
        c = (await r.fetchMarkets()).filter(function (e) {
          return e.symbol === a + "/" + n;
        })[0];
      console.log(c), console.log("------------");
      var i = null;
      "binance" === o &&
        (i = {
          amount_min: c.limits.amount.min,
          price_min: c.limits.price.min,
          cost_min: c.limits.cost.min,
          symbol: a + "/" + n,
          baseCur: a,
          quoteCur: n,
          exchange: o,
        }),
        "hitbtc" === o &&
          (i = {
            amount_min: c.limits.amount.min,
            price_min: c.limits.price.min,
            cost_min: c.limits.cost.min,
            symbol: a + "/" + n,
            baseCur: a,
            quoteCur: n,
            exchange: o,
          }),
        "bittrex" === o &&
          (i = {
            amount_min: c.limits.amount.min,
            price_min: c.limits.price.min,
            cost_min: 0,
            symbol: a + "/" + n,
            baseCur: a,
            quoteCur: n,
            exchange: o,
          }),
        t.json(i);
    } catch (i) {
      console.log("-------------------------"),
        e.log.error(i.stack),
        console.log("-------------------------");
      const a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/getTradeHistory", async (e, t) => {
    try {
      const i = e.query.exchange,
        a = e.query.symbol,
        n = JSON.parse(e.headers.credentials),
        o = n.date;
      let r, c;
      (r =
        void 0 === n.password
          ? void 0 === n.uid
            ? await getExchange(i, n.apiKey.trim(), n.apiSecret.trim())
            : await getExchange(
                i,
                n.apiKey.trim(),
                n.apiSecret.trim(),
                null,
                n.uid.trim()
              )
          : await getExchange(i, n.apiKey, n.apiSecret, n.password.trim())),
        (c = void 0 === o ? new Date("5/23/2017") : new Date(o)),
        console.log("date: " + c);
      const s = { tradeData: await r.fetchTrades(a, c.getMilliseconds(), 1e3) };
      t.json(s);
    } catch (i) {
      e.log.error(i);
      const a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/getExchangeTradeFees", async (e, t, i) => {
    t.json({
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
      percentages: !0,
    });
  }),
  app.get("/getIsPaymentIDRequired", async (e, t, i) => {
    try {
      parkersFunction.getIsCoinPaymentID(
        function (e) {
          const i = [];
          for (var a in e) {
            const t = e[a];
            let n = !1;
            (!0 !== t.payinPaymentId && !0 !== t.payoutIsPaymentId) || (n = !0);
            const o = {
              isPaymentID: n,
              isOutPaymentID: t.payoutIsPaymentId,
              isInPaymentID: t.payinPaymentId,
              symbol: t.id,
            };
            i.push(o);
          }
          t.json(i);
        },
        function (i) {
          console.log("-------------------------"),
            e.log.error(i.stack),
            console.log("-------------------------"),
            writeFile(
              "logs\\errorIsPaymentID\\errorIsPaymentID",
              i,
              "errorIsPaymentID"
            );
          const a = { error: !0, message: i };
          t.json(a);
        }
      );
    } catch (i) {
      e.log.error(i),
        writeFile(
          "logs\\errorIsPaymentID\\errorIsPaymentID",
          i,
          "errorIsPaymentID"
        );
      const a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/getOrderBooks", async (e, t, i) => {
    try {
      e.query.baseCur, e.query.quoteCur;
      const i = await getExchange(e.query.exchange);
      if (null != i) {
        const a = await i.fetchOrderBook(
          e.query.baseCur + "/" + e.query.quoteCur
        );
        0, t.json(a);
      } else {
        var a = { error: !0, message: "not able to get exchange", stack: "-" };
        console.log("-------------------------"),
          e.log.error(a),
          console.log("-------------------------"),
          t.json(a);
      }
    } catch (i) {
      e.log.error(i),
        writeFile(
          "logs\\errorOrderBooks\\errorOrderBooks",
          i,
          "errorOrderBooks"
        );
      a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/getDepositAddress", async (e, t, i) => {
    try {
      const i = JSON.parse(e.headers.credentials);
      let n;
      const o = e.query.exchange;
      if (
        null !=
        (n =
          void 0 === i.password
            ? void 0 === i.uid
              ? await getExchange(o, i.apiKey.trim(), i.apiSecret.trim())
              : await getExchange(
                  o,
                  i.apiKey.trim(),
                  i.apiSecret.trim(),
                  null,
                  i.uid.trim()
                )
            : await getExchange(o, i.apiKey, i.apiSecret, i.password.trim()))
      ) {
        const i = e.headers.tradeid,
          a = await n.fetchDepositAddress(e.query.baseCur);
        void 0 !== i || (a.tradeID = i), t.json(a);
      } else {
        var a = { error: !0, message: "not able to get exchange", stack: "-" };
        console.log("-------------------------"),
          e.log.error(a),
          console.log("-------------------------"),
          t.json(a);
      }
    } catch (i) {
      console.log("-------------------------"),
        e.log.error(i.stack),
        console.log("-------------------------"),
        writeFile("errorDepositAddress", i, "errorDepositAddress");
      a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/getWithdrawDepositFee", async (e, t, i) => {
    try {
      const i = e.query.exchange,
        a = e.query.Currency;
      if ("binance" === i) {
        console.log("-------------------------------creds-----"),
          console.log(e.headers),
          console.log("-----------------------------------------");
        const n = JSON.parse(e.headers.credentials),
          o = e.query.withOrDep;
        console.log("parker:"),
          console.log(parkersFunction),
          await parkersFunction
            .getWithdrawFeeAndActive(
              i,
              a,
              o,
              null,
              n.apiKey.trim(),
              n.apiSecret.trim()
            )
            .then(
              function (n) {
                try {
                  const o = parkersFunction.parseData(i, n, a);
                  0, t.json(o);
                } catch (i) {
                  const a = { error: !0, message: i };
                  e.log.error(i), t.json(a);
                }
              },
              function (i) {
                e.log.info(i), t.json(i);
              }
            );
      } else {
        const n = e.query.withOrDep;
        await parkersFunction
          .getWithdrawFeeAndActive(i, a, n, null, null, null)
          .then(
            function (n) {
              try {
                const o = parkersFunction.parseData(i, n, a);
                0, t.json(o);
              } catch (i) {
                const a = { error: !0, message: i };
                console.log("catch error"), e.log.error(i), t.json(a);
              }
            },
            function (i) {
              console.log("big error"), e.log.info(i), t.json(i);
            }
          );
      }
    } catch (i) {
      console.log("-------------------------"),
        e.log.error(i.stack),
        console.log("-------------------------"),
        writeFile(
          "logs\\errorWithdrawDepositFees\\errorWithdrawDepositFees",
          i,
          "errorWithdrawDepositFees"
        );
      const a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/performWithdraw", async (e, t, i) => {
    try {
      const i = JSON.parse(e.headers.credentials),
        n = e.headers.tradeID;
      let o;
      if (
        null !=
        (o =
          void 0 === i.password
            ? void 0 === i.uid
              ? await getExchange(
                  e.query.exchange,
                  i.apiKey.trim(),
                  i.apiSecret.trim()
                )
              : await getExchange(
                  e.query.exchange,
                  i.apiKey.trim(),
                  i.apiSecret.trim(),
                  null,
                  i.uid.trim()
                )
            : await getExchange(
                e.query.exchange,
                i.apiKey,
                i.apiSecret,
                i.password.trim()
              ))
      ) {
        const a = e.headers.address,
          r = e.headers.amount;
        let c;
        (c =
          void 0 !== i.paymentID
            ? await o.withdraw(e.query.symbol, r, a, { paymentId: i.paymentID })
            : await o.withdraw(e.query.symbol, r, a)),
          void 0 !== n && (c.tradeID = n),
          t.json(c);
      } else {
        var a = { error: !0, message: "not able to get exchange", stack: "-" };
        console.log("-------------------------"),
          e.log.error(a),
          console.log("-------------------------"),
          t.json(a);
      }
    } catch (i) {
      console.log("-------------------------"),
        e.log.error(i.stack),
        console.log("-------------------------");
      try {
        writeFile(
          "logs\\errorPerformWithdraw\\errorPerformWithdraw",
          i,
          "errorPerformWithdraw"
        );
      } catch (e) {}
      a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/getMarkets", async (e, t, i) => {
    try {
      const i = await getExchange(e.query.exchange);
      if (null != i) {
        e.headers.tradeID;
        const a = await i.fetchMarkets();
        console.log(a), t.json(a);
      } else {
        var a = { error: !0, message: "not able to get exchange", stack: "-" };
        console.log("-------------------------"),
          e.log.error(a),
          console.log("-------------------------"),
          t.json(a);
      }
    } catch (i) {
      e.log.error(i),
        writeFile(
          "logs\\errorGetMarkets\\errorGetMarkets",
          i,
          "errorGetMarkets"
        );
      a = { error: !0, message: i };
      t.json(a);
    }
  }),
  app.get("/testExchange", async (e, t, i) => {
    var a = JSON.parse(e.headers.credentials, a.apiKey, a.apiSecret);
    const n = {
      fetchMarkets: !1,
      fetchOrderBook: !1,
      fetchTicker: !1,
      fetchBalance: !1,
      successTotal: !1,
      error: { Exception: null },
      data: { markets: null, orderbook: null, ticker: null, balance: null },
      exchange: "string",
    };
    try {
      let i;
      (i =
        void 0 === a.password
          ? void 0 === a.uid
            ? await getExchange(
                e.query.exchange,
                a.apiKey.trim(),
                a.apiSecret.trim()
              )
            : await getExchange(
                e.query.exchange,
                a.apiKey.trim(),
                a.apiSecret.trim(),
                null,
                a.uid.trim()
              )
          : await getExchange(
              e.query.exchange,
              a.apiKey,
              a.apiSecret,
              a.password.trim()
            )),
        (n.exchange = e.query.exchange);
      const o = await i.fetchMarkets(),
        r = await i.fetchOpenOrders(),
        c = await i.fetchTicker(),
        s = await i.fetchBalance();
      null != o && ((n.fetchMarkets = !0), (n.data.markets = o)),
        null != r && ((n.fetchOrderBook = !0), (n.data.orderbook = r)),
        null != c && ((n.fetchTicker = !0), (n.data.ticker = c)),
        null != s && ((n.fetchBalance = !0), (n.data.balance = s)),
        console.log(n),
        t.json(reult_public);
    } catch (e) {
      console.log(e);
      const i = { error: !0, message: e };
      t.json(i);
    }
  }),
  app.get("/checkExchange", async (e, t, i) => {
    try {
      const i = await getExchange(e.query.exchange),
        a = await i.fetchMarkets();
      void 0 !== a && t.json(a);
    } catch (i) {
      e.log.error(i), t.json("[]");
    }
  });
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
  inputPrompt(prompt, function (e) {
    var t = !1;
    console.log(e);
    var i = 0;
    if (
      ((i = isNaN(e.cores) ? workers : e.cores),
      "enabled" === e["startup configuration"] && (t = !0),
      !0 === t)
    ) {
      console.log("start cluster with %s workers", i);
      for (var a = 0; a < i; ++a) {
        var n = cluster.fork().process;
        console.log("worker %s started.", n.pid);
      }
      cluster.on("exit", function (e) {
        console.log("worker %s died. restart...", e.process.pid),
          cluster.fork();
      });
    } else n = cluster.fork().process;
  });
} else
  app.listen(3e3, () =>
    console.log("Example app listening on port 3000!, optimzed is set:" + !0)
  ),
    (module.exports = app);
module.exports = server;
//# sourceMappingURL=all-min.js.map
