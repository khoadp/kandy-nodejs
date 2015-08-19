var Utils   = require('./Utils'),
    utils   = new Utils();

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
 * Get addressbook.
 * @param userAccessToken
 * @param callback
 */
Users.prototype.getAddressbook = function (userAccessToken, callback) {
    // Get user device id
    var args = {
        parameters: {
            key: userAccessToken
        },
        headers: {'Content-Type': 'application/json'}
    };
    this.client.methods.getAddressbook(args, callback);
};

/**
 * Get all groups of a specific user.
 * @param userAccessToken
 * @param callback
 */
Users.prototype.getGroups = function (userAccessToken, callback) {
    var args = {
        parameters: {
            key: userAccessToken
        },
        headers: {'Content-Type': 'application/json'}
    };
    this.client.methods.getGroups(args, callback);
};

/**
 * Create a group.
 * @param userAccessToken
 * @param name
 * @param image
 * @param callback
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
    this.client.methods.createGroup(args, callback);
};

/**
 * Get group object by its ID.
 * @param userAccessToken
 * @param id
 * @param callback
 */
Users.prototype.getGroupById = function (userAccessToken, id, callback) {
    var args = {
        parameters: {
            key: userAccessToken,
            group_id: id
        },
        headers: {'Content-Type': 'application/json'}
    };
    this.client.methods.getGroupById(args, callback);
};

/**
 * Update a group.
 * @param userAccessToken
 * @param id
 * @param name
 * @param image
 * @param callback
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
    this.client.methods.updateGroup(args, callback);
};

/**
 * delete a group.
 * @param userAccessToken
 * @param id
 * @param callback
 */
Users.prototype.deleteGroup = function (userAccessToken, id, callback) {
    var url = this.apiURL + '/users/chatgroups/chatgroup?key=' + userAccessToken + '&group_id=' + id;
    this.client.delete(url, {}, callback);
};

/**
 * Add all members to the group.
 * @param userAccessToken
 * @param id
 * @param members
 * @param callback
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
    this.client.methods.addGroupMembers(args, callback);
};

/**
 * Remove all the members from the group.
 * @param userAccessToken
 * @param id
 * @param members
 * @param callback
 */
Users.prototype.removeGroupMembers = function (userAccessToken, id, members, callback) {
    var jsonMembers = JSON.stringify(members);

    var url = this.apiURL + '/users/chatgroups/chatgroup/members?key=' + userAccessToken + '&group_id=' + id + '&members=' + encodeURIComponent(jsonMembers);
    this.client.delete(url, {}, callback);
};

/**
 * Remove the requesting user from the group.
 * @param userAccessToken
 * @param id
 * @param callback
 */
Users.prototype.leaveGroup = function (userAccessToken, id, callback) {
    var url = this.apiURL + '/users/chatgroups/chatgroup/members/membership?key=' + userAccessToken + '&group_id=' + id;
    this.client.delete(url, {}, callback);
};

/**
 * Send group.
 * @param userAccessToken
 * @param to
 * @param text
 * @param callback
 */
Users.prototype.sendGroupIm = function (userAccessToken, to, text, callback) {
    // Send sms
    //console.log(to);
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
    this.client.methods.sendGroupIm(messageArgs, callback);
};

module.exports = Users;