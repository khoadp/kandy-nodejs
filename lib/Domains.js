var Q = require("q");

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
 *
 * @method getUserAccessToken
 * @param {String} userId
 * @param {String} password
 * @param {Function} callback
 */
Domains.prototype.getUserAccessToken = function (userId, password, callback) {
    var userAccessTokenArgs = {
        parameters: {
            key: this.apiKey,
            user_id: userId,
            user_password: password
        }
    };
    this.getInfoUserAccessToken(userAccessTokenArgs)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Get information of user access token.
 *
 * @method getInfoUserAccessToken
 * @param {Object} args
 * @return {Function} callback
 */
Domains.prototype.getInfoUserAccessToken = function (args) {
    var deferred = Q.defer();
    this.client.methods.getUserAccessToken(args, deferred.resolve);
    return deferred.promise;
};

/**
 * Get domain access token.
 *
 * @method getDomainAccessToken
 * @param {Function} callback
 */
Domains.prototype.getDomainAccessToken = function (callback) {
    // Get domain access token
    var domainAccessTokenArgs = {
        parameters: {
            key: this.apiKey,
            domain_api_secret: this.domainApiSecret
        }
    };
    this.getInfoDomainAccessToken(domainAccessTokenArgs)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Get information of domain access token.
 *
 * @method getInfoDomainAccessToken
 * @param {Object} args
 * @return {Function} callback
 */
Domains.prototype.getInfoDomainAccessToken = function (args) {
    var deferred = Q.defer();
    this.client.methods.getDomainAccessToken(args, deferred.resolve);
    return deferred.promise;
};

/**
 * Get list users.
 *
 * @method getListUsers
 * @param {String} domainAccessToken
 * @param {Function} callback
 */
Domains.prototype.getListUsers = function (domainAccessToken, callback) {
    var listUsersArgs = {
        parameters: {
            key: domainAccessToken
        }
    };
    this.getInfoListUsers(listUsersArgs)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Get information of list users.
 *
 * @method getInfoListUsers
 * @param {Object} args
 * @return {Function} callback
 */
Domains.prototype.getInfoListUsers = function (args) {
    var deferred = Q.defer();
    this.client.methods.getListUsers(args, deferred.resolve);
    return deferred.promise;
};

module.exports = Domains;