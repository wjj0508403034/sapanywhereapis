'use strict';

function Configuration() {
  this.anywhereHostName = "go.sapanywhere.com";
  this.apiHostName = "api.sapanywhere.com";
}

Configuration.prototype.setHostNames = function(anywhereHostName, apiHostName) {
  this.anywhereHostName = anywhereHostName;
  this.apiHostName = apiHostName;
};

module.exports = Configuration;