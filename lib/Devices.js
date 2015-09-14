var Utils  = require('./Utils'),
    utils  = new Utils();
var Q = require("q");

var Devices = function(options) {
    var apiURL  = options.apiURL;
    this.client = options.client;
    this.client.registerMethod('sendSms', apiURL + '/devices/smss', 'POST');
    this.client.registerMethod('sendIm', apiURL + '/devices/messages', 'POST');
    this.client.registerMethod('getIm', apiURL + '/devices/messages', 'GET');
};

/**
 * Get user device.
 *
 * @method getUserDevice
 * @param {Object} userDeviceArgs
 * @return {Function} callback
 */
Devices.prototype.getUserDevice = function (userDeviceArgs) {
    var deferred = Q.defer();
    this.client.methods.getUserDevice(userDeviceArgs, deferred.resolve);
    return deferred.promise;
};

/**
 * Send SMS to a user.
 *
 * @method sendSms
 * @param {String} userAccessToken
 * @param {String} from
 * @param {String} to
 * @param {String} text
 * @return {Function} callback
 */
Devices.prototype.sendSms = function (userAccessToken, from, to, text, callback) {

    // Get user device id
    var userDeviceArgs = {
        parameters: {
            key: userAccessToken
        }
    };

    this.getUserDevice(userDeviceArgs)
        .then((function(data) {
            return this.startSendSms(data, userAccessToken, from, to, text);
        }).bind(this))
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Start send a SMS.
 *
 * @method startSendSms
 * @param {Object} data
 * @param {String} userAccessToken
 * @param {String} to
 * @param {String} text
 * @return {Function} callback
 */
Devices.prototype.startSendSms = function(data, userAccessToken, from, to, text) {
    var dataJson = JSON.parse(data);
    if (dataJson.message == 'success') {
        var userDeviceId = dataJson.result.devices[0].id;
        // Send sms
        var smsArgs = {
            data: {
                message: {
                    destination: to,
                    source: from,
                    message: {
                        text: text
                    }
                }
            },
            parameters: {key: userAccessToken, device_id: userDeviceId},
            headers: {'Content-Type': 'application/json'}
        };
        var deferred = Q.defer();
        this.client.methods.sendSms(smsArgs, deferred.resolve);
        return deferred.promise;
    }
};

/**
 * Send a message.
 *
 * @method sendIm
 * @param {String} userAccessToken
 * @param {String} to
 * @param {String} text
 * @return {Function} callback
 */
Devices.prototype.sendIm = function (userAccessToken, to, text, callback) {
    var userDeviceArgs = {
        parameters: {
            key: userAccessToken
        }
    };

    this.getUserDevice(userDeviceArgs)
        .then((function(data) {
            return this.sendMessage(data, userAccessToken, to, text);
        }).bind(this))
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Send a message.
 *
 * @method sendMessage
 * @param {Object} data
 * @param {String} userAccessToken
 * @param {String} to
 * @param {String} text
 * @return {Function} callback
 */
Devices.prototype.sendMessage = function(data, userAccessToken, to, text) {
    var dataJson = JSON.parse(data);
    if (dataJson.message == 'success') {
        var userDeviceId = dataJson.result.devices[0].id;
        // Send sms
        var messageArgs = {
            data: {
                message: {
                    contentType: 'text',
                    destination: to,
                    UUID: utils.guid(),
                    message: {
                        mimeType: 'text/plain',
                        text: text
                    }
                }
            },
            parameters: {key: userAccessToken, device_id: userDeviceId},
            headers: {'Content-Type': 'application/json'}
        };
        var deferred = Q.defer();
        this.client.methods.sendIm(messageArgs, deferred.resolve);
        return deferred.promise;
    }
};

/**
 * Get pending messages.
 *
 * @method getIm
 * @param {String} userAccessToken
 * @param {Boolean} autoClear
 * @return {Function} callback
 */
Devices.prototype.getIm = function (userAccessToken, autoClear, callback) {
    var userDeviceArgs = {
        parameters: {
            key: userAccessToken
        }
    };

    this.getUserDevice(userDeviceArgs)
        .then((function(data) {
            return this.getDataForMessage(data, userAccessToken);
        }).bind(this))
        .then((function(data) {
            return this.getMessagesChat(data, userAccessToken, autoClear);
        }).bind(this))
        .then(function(data) {
            callback(data, null);
        }).done();
};

/**
 * Get data for pending messages.
 *
 * @method getDataForMessage
 * @param {Object} data
 * @return {Object}
 */
Devices.prototype.getDataForMessage = function(data, userAccessToken) {
    var dataJson = JSON.parse(data);
    if (dataJson.message == 'success') {
        var userDeviceId = dataJson.result.devices[0].id;
        this.userDeviceId = userDeviceId;
        var messageArgs = {
            parameters: {key: userAccessToken, device_id: userDeviceId},
            headers: {'Content-Type': 'application/json'}
        };

        var deferred = Q.defer();
        this.client.methods.getIm(messageArgs, deferred.resolve);
        return deferred.promise;
    }
};

/**
 * Get message of chat process.
 *
 * @method getMessagesChat
 * @param {Object} data
 * @param {String} userAccessToken
 * @param {Boolean} autoClear
 * @return {Object}
 */
Devices.prototype.getMessagesChat = function(data, userAccessToken, autoClear) {
    var dataJson = JSON.parse(data);
    if (dataJson.message == 'success') {
        if (dataJson.result.messages.length) {
            if (autoClear === undefined || autoClear === true) {
                var id_list = dataJson.result.messages.map(function (item) {
                    return item.UUID;
                });

                if(this.userDeviceId != null) {
                    var i = 0;
                    var encodedData = null;
                    for (i; i < id_list.length; i += 10) {
                        encodedData = encodeURIComponent('["' + id_list.slice(i, i + 10).join('","') + '"]');
                        var url = this.apiURL + '/devices/messages?key=' + userAccessToken + '&messages=' + encodedData + '&device_id=' + this.userDeviceId;
                        this.client.delete(url, {}, function (data, res) {
                            this.userDeviceId = null;
                        });
                    }
                }
            }
        }
    }
    var deferred = Q.defer();
    deferred.resolve(data);
    return deferred.promise;
};

module.exports = Devices;