const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const is = require('is_js');

/**
 * Validates the configuration parameters that will be used for deployment
 * @param {Object} serverless - Instance of the Serverless class
 * @param {Object} options - Command line options passed to serverless client
 */
function validateClient(serverless, options) {
  let validationErrors = [];

  // path to website files must exist
  const distributionFolder = options.distributionFolder || path.join('client/dist');
  const clientPath = path.join(serverless.config.servicePath, distributionFolder);
  if (!serverless.utils.dirExistsSync(clientPath)) {
    validationErrors.push(`Could not find '${clientPath}' folder in your project root`);
  }

  // bucketName must be a string
  if (!is.string(options.bucketName)) {
    validationErrors.push('Please specify a bucket name for the client in serverless.yml');
  }

  // check header options
  if (options.objectHeaders) {
    if (!is.object(options.objectHeaders)) {
      validationErrors.push('objectHeaders must be an object');
    }

    Object.keys(options.objectHeaders).forEach(p => {
      if (!is.array(options.objectHeaders[p])) {
        validationErrors.push('Each member of objectHeaders must be an array');
      }

      options.objectHeaders[p].forEach(h => {
        if (!(is.existy(h.name) && is.string(h.name))) {
          validationErrors.push(`Each object header must have a (string) 'name' attribute`);
        }

        if (!(is.existy(h.value) && is.string(h.value))) {
          validationErrors.push(`Each object header must have a (string) 'value' attribute`);
        }
      });
    });
  }

  // check website configuration options

  if (validationErrors.length > 0) {
    throw validationErrors;
  }
}

module.exports = validateClient;
