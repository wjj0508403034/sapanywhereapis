'use strict';

const RestClient = require("huoyun-restclient");

function getHeaders(auth) {
  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Access-Token": auth.tokens["access_token"]
  };
}

function getUrl(auth, path) {
  return `https://${auth.config.apiHostName}/v1/${path}`;
}

module.exports = {
  query: function(auth, boName) {
    return RestClient.get(getUrl(auth, boName), getHeaders(auth));
  },
  get: function(auth, boName, boId) {
    return RestClient.get(getUrl(auth, `${boName}/${boId}`), getHeaders(auth));
  },
  delete: function(auth, boName, boId) {
    return RestClient.delete(getUrl(auth, `${boName}/${boId}`), getHeaders(auth));
  },

  post: function(auth, boName, data) {
    return RestClient.delete(getUrl(auth, boName), data, getHeaders(auth));
  }
};