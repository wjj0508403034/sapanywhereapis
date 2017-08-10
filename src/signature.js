'use strict';

const Crypto = require('crypto');

function Signature(clientId, clientSecret, timestamp) {
  let content = `apiKey=${clientId}&timestamp=${timestamp}`;
  this.signature = Crypto.createHmac('sha256', clientSecret)
    .update(content)
    .digest('hex');
}

Signature.prototype.equals = function(hmac) {
  return this.signature === hmac;
};

module.exports = Signature;