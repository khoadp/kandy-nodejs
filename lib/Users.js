var Utils   = require('./Utils'),
    utils   = new Utils();
var Q = require("q");

var Users = function(options) {
    var apiURL  = options.apiURL;
    this.client = options.client;
    this.client.registerMethod('getUserDevice', apiURL + '/users/devices', 'GET');
    this.client.registerMethod('getAddressbook', apiURL + '/users/addressbooks/personal', 'GET');
    this.client.registerMethod('getGroups', apiURL + '/users/chatgroups', 'GET');
    this.client.registerMethod('createGroup', apiURL + '/users/chatgroups', 'POST');
    this.client.registerMethod('getGroupById', apiURL + '/users/chatgroups/chatgroup', 'GET');
    this.client.registerMethod('updateGroup', apiURL + '/users/chatgroups/chatgroup', 'PUT');
    this.client.registerMethod('deleteGroup', apiURL + '/users/chatgroups/chatgroup', 'DELETE');
    this.client.registerMethod('addGroupMembers', apiURL + '/users/chatgroups/chatgroup/members', 'POST');
    this.client.registerMethod('removeGroupMembers', apiURL + '/users/chatgroups/chatgroup/members', 'DELETE');
    this.client.registerMethod('leaveGroup', apiURL + '/users/chatgroups/chatgroup/members/membership', 'DELETE');
    this.client.registerMethod('sendGroupIm', apiURL + '/users/chatgroups/chatgroup/messages', 'POST');
};

/**
 * Get address book.
 *
 * @method getAddressbook
 * @param {String} userAccessToken
 * @return {Function} callback
 */
Users.prototype.getAddressbook = function (userAccessToken, callback) {
    // Get user device id
    var args = {
        parameters: {
            key: userAccessToken
        },
        headers: {'Content-Type': 'application/json'}
    };
    this.getInfoAddressBook(args)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Get information of address book.
 *
 * @method getInfoAddressBook
 * @param {Object} args
 * @return {Function} callback
 */
Users.prototype.getInfoAddressBook = function (args) {
    var deferred = Q.defer();
    this.client.methods.getAddressbook(args, deferred.resolve);
    return deferred.promise;
};

/**
 * Get all groups of a specific user.
 * @param {String} userAccessToken
 * @param {Function} callback
 */
Users.prototype.getGroups = function (userAccessToken, callback) {
    var args = {
        parameters: {
            key: userAccessToken
        },
        headers: {'Content-Type': 'application/json'}
    };
    this.getInfoGroups(args)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Get information of all groups.
 *
 * @method getInfoGroups
 * @param {Object} args
 * @return {Function} callback
 */
Users.prototype.getInfoGroups = function (args) {
    var deferred = Q.defer();
    this.client.methods.getGroups(args, deferred.resolve);
    return deferred.promise;
};

/**
 * Create a group.
 *
 * @method createGroup
 * @param {String} userAccessToken
 * @param {String} name
 * @param {String} image
 * @param {Function} callback
 */
Users.prototype.createGroup = function (userAccessToken, name, image, callback) {
    var args = {
        parameters: {
            key: userAccessToken,
            group_name: name,
            group_image: {}
        },
        headers: {'Content-Type': 'application/json'}
    };
    this.sendInfoCreateGroup(args)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Send information of a group.
 *
 * @method sendInfoCreateGroup
 * @param {Object} args
 * @return {Function} callback
 */
Users.prototype.sendInfoCreateGroup = function (args) {
    var deferred = Q.defer();
    this.client.methods.createGroup(args, deferred.resolve);
    return deferred.promise;
};

/**
 * Get group object by its ID.
 *
 * @method getGroupById
 * @param {String} userAccessToken
 * @param {Number} id
 * @param {Function} callback
 */
Users.prototype.getGroupById = function (userAccessToken, id, callback) {
    var args = {
        parameters: {
            key: userAccessToken,
            group_id: id
        },
        headers: {'Content-Type': 'application/json'}
    };
    this.sendInfoGroup(args)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Send information's group.
 *
 * @method sendInfoGroup
 * @param {Object} args
 * @return {Function} callback
 */
Users.prototype.sendInfoGroup = function (args) {
    var deferred = Q.defer();
    this.client.methods.getGroupById(args, deferred.resolve);
    return deferred.promise;
};

/**
 * Update a group.
 *
 * @method updateGroup
 * @param {String} userAccessToken
 * @param {Number} id
 * @param {String} name
 * @param {String} image
 * @param {Function} callback
 */
Users.prototype.updateGroup = function (userAccessToken, id, name, image, callback) {
    var args = {
        parameters: {
            key: userAccessToken,
            group_id: id,
            group_name: name,
            group_image: {}
        },
        headers: {'Content-Type': 'application/json'}
    };
    this.sendInfoUpdateGroup(args)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Send information's updated group.
 *
 * @method sendInfoUpdateGroup
 * @param {Object} args
 * @return {Function} callback
 */
Users.prototype.sendInfoUpdateGroup = function (args) {
    var deferred = Q.defer();
    this.client.methods.updateGroup(args, deferred.resolve);
    return deferred.promise;
};

/**
 * Delete a group.
 *
 * @method deleteGroup
 * @param {String} userAccessToken
 * @param {Number} id
 * @param {Function} callback
 */
Users.prototype.deleteGroup = function (userAccessToken, id, callback) {
    var url = this.apiURL + '/users/chatgroups/chatgroup?key=' + userAccessToken + '&group_id=' + id;
    this.sendInfoDelete(url)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Send information's deleted group.
 *
 * @method sendInfoDeleteGroup
 * @param {String} url
 * @return {Function} callback
 */
Users.prototype.sendInfoDelete = function (url) {
    var deferred = Q.defer();
    this.client.delete(url, {}, deferred.resolve);
    return deferred.promise;
};

/**
 * Add all members to the group.
 *
 * @method addGroupMembers
 * @param {String} userAccessToken
 * @param {Number} id
 * @param {String} members
 * @param {Function} callback
 */
Users.prototype.addGroupMembers = function (userAccessToken, id, members, callback) {
    var jsonMembers = JSON.parse(members);

    var args = {
        parameters: {
            key: userAccessToken,
            group_id: id
        },
        data: {
            members: jsonMembers
        },
        headers: {'Content-Type': 'application/json'}
    };
    this.sendInfoAddGroupMembers(args)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Send information's add members group.
 *
 * @method sendInfoAddGroupMembers
 * @param {Object} args
 * @return {Function} callback
 */
Users.prototype.sendInfoAddGroupMembers = function (args) {
    var deferred = Q.defer();
    this.client.methods.addGroupMembers(args, deferred.resolve);
    return deferred.promise;
};

/**
 * Remove all the members from the group.
 *
 * @method removeGroupMembers
 * @param {String} userAccessToken
 * @param {Number} id
 * @param {String} members
 * @param {Function} callback
 */
Users.prototype.removeGroupMembers = function (userAccessToken, id, members, callback) {
    var jsonMembers = JSON.stringify(members);
    var url = this.apiURL + '/users/chatgroups/chatgroup/members?key=' + userAccessToken + '&group_id=' + id + '&members=' + encodeURIComponent(jsonMembers);
    this.sendInfoDelete(url)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Remove the requesting user from the group.
 *
 * @method leaveGroup
 * @param {String} userAccessToken
 * @param {Number} id
 * @param {Function} callback
 */
Users.prototype.leaveGroup = function (userAccessToken, id, callback) {
    var url = this.apiURL + '/users/chatgroups/chatgroup/members/membership?key=' + userAccessToken + '&group_id=' + id;
    this.sendInfoDelete(url)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Send a group.
 *
 * @method sendGroupIm
 * @param {String} userAccessToken
 * @param {String} to
 * @param {String} text
 * @return {Function} callback
 */
Users.prototype.sendGroupIm = function (userAccessToken, to, text, callback) {
    var messageArgs = {
        data: {
            message: {
                contentType: 'text',
                group_id: to,
                UUID: utils.guid(),
                message: {
                    mimeType: 'text/plain',
                    text: text
                }
            }
        },
        parameters: {key: userAccessToken},
        headers: {'Content-Type': 'application/json'}
    };
    this.sendInfoGroupIm(messageArgs)
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Send information's group.
 *
 * @method sendInfoGroupIm
 * @param {Object} args
 * @return {Function} callback
 */
Users.prototype.sendInfoGroupIm = function (args) {
    var deferred = Q.defer();
    this.client.methods.sendGroupIm(args, deferred.resolve);
    return deferred.promise;
};

module.exports = Users;