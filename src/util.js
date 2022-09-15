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
