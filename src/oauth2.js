'use strict';

const Logger = require('request-log4js').getLogger("oauth2");
const RestClient = require("huoyun-restclient");
const Configuration = require("./config");
const Signature = require("./signature");

const Headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json'
};

function OAuth2(clientId, clientSecret, applicationUrl, installationUrl) {
  this.config = new Configuration();
  this.scope = "BusinessData_R,BusinessData_RW";
  this.clientId = clientId;
  this.clientSecret = clientSecret;
  this.applicationUrl = applicationUrl;
  this.installationUrl = installationUrl;
}

OAuth2.prototype.setConfig = function(config) {
  if (config instanceof Configuration) {
    this.config = config;
    return;
  }

  throw new Error(`Config is not instance of ${Configuration}`);
};

OAuth2.prototype.setScope = function(scope) {
  this.scope = scope;
};

OAuth2.prototype.getSAPAnywhereHostName = function() {
  if (!(this.config instanceof Configuration)) {
    throw new Error(`Config is not instance of ${Configuration}`);
  }

  let host = this.config.anywhereHostName;

  if (!host) {
    throw new Error(`SAPAnywhere host name not set.`);
  }

  return host;
};

OAuth2.prototype.generateAuthUrl = function() {
  return `https://${this.getSAPAnywhereHostName()}/oauth2/authorize?client_id=${this.clientId}&scope=${this.scope}&redirect_uri=${this.applicationUrl}`;
};

OAuth2.prototype.generateInstallUrl = function() {
  return `https://${this.getSAPAnywhereHostName()}/oauth2/authorize?client_id=${this.clientId}&scope=${this.scope}&redirect_uri=${this.installationUrl}`;
};

OAuth2.prototype.getTokenUrl = function() {
  try {
    let host = this.getSAPAnywhereHostName();
    return Promise.resolve(`https://${host}/oauth2/token`);
  } catch (ex) {
    return Promise.reject(ex);
  }
};

OAuth2.prototype.setCredentials = function(tokens) {
  this.tokens = tokens;
};

OAuth2.prototype.getTokenByCode = function(code, redirect_uri) {

  let payload = {
    client_id: this.clientId,
    client_secret: this.clientSecret,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirect_uri
  };

  return this.getTokenUrl()
    .then(function(url) {
      return RestClient.post(url, payload, Headers);
    }).then(function(data) {
      if (data["error"]) {
        throw data;
      }

      if (typeof data !== "object") {
        throw data;
      }

      return Promise.resolve(data);
    }).catch(function(err) {
      return Promise.reject(err);
    });
};

OAuth2.prototype.getTokenByRefreshToken = function() {
  return Promise.all([this.getTokenUrl(), this.__getTokenByRefreshTokenPayload()])
    .then(function(values) {
      return RestClient.post(values[0], values[1], Headers);
    }).then(function(data) {
      if (data["error"]) {
        return Promise.reject(data);
      }
      return Promise.resolve(data);
    }).catch(function(err) {
      return Promise.reject(err);
    });
};

OAuth2.prototype.__getTokenByRefreshTokenPayload = function() {
  if (this.tokens && this.tokens["refresh_token"]) {
    let payload = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "refresh_token",
      refresh_token: this.tokens["refresh_token"],
      redirect_uri: this.applicationUrl
    };

    return Promise.resolve(payload);
  }

  return Promise.reject("OAuth client hasn't authorize.")
};

OAuth2.prototype.verifySignature = function(hmac, timestamp) {
  let sign = new Signature(this.clientId, this.clientSecret, timestamp);
  return sign.equals(hmac);
};


module.exports = OAuth2;