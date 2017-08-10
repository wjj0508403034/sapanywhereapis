# SAP Anywhere APIs Nodejs Client

[Node.js][node] client library for using SAP Anywhere APIs. Support for authorization and authentication with OAuth 2.0, API Keys is included.

## Installation

This library is distributed on `npm`. In order to add it as a dependency,
run the following command:

``` sh
$ npm install sapanywhereapis --save
```

## Usage

### Authorizing and authenticating

#### OAuth2 client

This client comes with an [OAuth2][oauth] client that allows you to retrieve an
access token and refreshes the token and retry the request seamlessly if you
also provide an `expiry_date` and the token is expired. 

##### Generating an authentication URL

To ask for permissions from a user to retrieve an access token, you
redirect them to a consent page. To create a consent page URL:

``` js
const SAPAnywhereApis = require("sapanywhereapis");

const auth = new SAPAnywhereApis.OAuth2(
  // Client Id
  "Pq1IRNhAzkZW8dNllYX1gLdbzBKwVlJZ",

  // Client Secret
  "vU-roN220UA7iq_F_kV-Q0IvEy27fyJS",

  // Application URL
  `http://localhost:8080/anywhere`,

  // Installation URL
  `http://localhost:8080/anywhere/install`
);
```

If using oauth client for e2e testing, you can change sap anywhere host following below code

```js
const AnywhereConfig = new SAPAnywhereApis.Config();
AnywhereConfig.setHostNames("go-mv.dd.smec.sap.corp", "api-mv.dd.smec.sap.corp");
auth.setConfig(AnywhereConfig);
```

##### Retrieve authorization code

Once a user has given permissions on the consent page, Google will redirect
the page to the redirect URL you have provided with a code query parameter.

    GET /callback?code={authorizationCode}

##### Retrieve access token

With the code returned, you can ask for an access token as shown below:

``` js
auth.getTokenByCode(code, redirect_uri)
  .then(function(tokens) {
  // Now tokens contains an access_token and an optional refresh_token. Save them.
  auth.setCredentials(tokens);
  }).catch(function(err) {
    // Occur error
  });
```

#### Using API keys

You may need to send an API key with the request you are going to make.
The following uses an API key to make a request to the SAP Anywhere API service to
retrieve a customer data:

``` js
SAPAnywhereApis.APIs.query(auth, 'Customers')
  .then(function(customers) {
    // Retrieve customer data
  }).catch(function(err) {
    // Occur error
  });
```