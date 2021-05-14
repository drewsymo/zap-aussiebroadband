const transactionReceiptTrigger = require("./triggers/transaction-receipt");

const {
  config: authentication,
  befores = [],
  afters = [],
} = require("./authentication");

// Zapier will automatically refresh the auth session if the API returns 401
const handleHTTPError = (response, z) => {
  if (response.status >= 400) {
    throw new Error(`Unexpected status code ${response.status}`);
  }

  return response;
};

module.exports = {
  version: require("./package.json").version,
  platformVersion: require("zapier-platform-core").version,
  authentication: authentication,
  beforeRequest: [...befores],
  afterResponse: [handleHTTPError, ...afters],
  resources: {},
  triggers: {
    [transactionReceiptTrigger.key]: transactionReceiptTrigger,
  },
  searches: {},
  creates: {},
};
