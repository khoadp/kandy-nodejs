var Domains = function(options) {
    if(options) {
        if(options.apiKey) {
            this.apiKey = options.apiKey;
        }
        if(options.domainApiSecret) {
            this.domainApiSecret = options.domainApiSecret;
        }
    }

    var apiURL  = options.apiURL;
    this.client = options.client;
    this.client.registerMethod('getUserAccessToken', apiURL + '/domains/users/accesstokens', 'GET');
    this.client.registerMethod('getDomainAccessToken', apiURL + '/domains/accesstokens', 'GET');
    this.client.registerMethod('getListUsers', apiURL + '/domains/users', 'GET');
};

/**
 * Get user access token.
 * @param userId
 * @param password
 * @param callback
 */
Domains.prototype.getUserAccessToken = function (userId, password, callback) {
    // Get user access token
    var userAccessTokenArgs = {
        parameters: {
            key: this.apiKey,
            user_id: userId,
            user_password: password
        }
    };

    this.client.methods.getUserAccessToken(userAccessTokenArgs, callback);
};

/**
 * Get domain access token.
 * @param callback
 */
Domains.prototype.getDomainAccessToken = function (callback) {
    // Get domain access token
    var domainAccessTokenArgs = {
        parameters: {
            key: this.apiKey,
            domain_api_secret: this.domainApiSecret
        }
    };

    this.client.methods.getDomainAccessToken(domainAccessTokenArgs, callback);
};

/**
 * Get list users.
 * @param domainAccessToken
 * @param callback
 */
Domains.prototype.getListUsers = function (domainAccessToken, callback) {
    // Get list users
    var listUsersArgs = {
        parameters: {
            key: domainAccessToken
        }
    };

    this.client.methods.getListUsers(listUsersArgs, callback);
};

module.exports = Domains;