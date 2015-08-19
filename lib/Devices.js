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
 * Send SMS to a user.
 * @param userAccessToken
 * @param from
 * @param to
 * @param text
 * @param callback
 */
Devices.prototype.sendSms = function (userAccessToken, from, to, text, callback) {

    // Get user device id
    var userDeviceArgs = {
        parameters: {
            key: userAccessToken
        }
    };

    //https://api.kandy.io/v1.2/users/devices?key=${key}
    this.client.methods.getUserDevice(userDeviceArgs, (function (data, response) {
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
            this.client.methods.sendSms(smsArgs, callback);
        }
    }).bind(this));
};

Devices.prototype.getUserDevice = function (userDeviceArgs) {
    var deferred = Q.defer();
    this.client.methods.getUserDevice(userDeviceArgs, deferred.resolve);
    return deferred.promise;
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
    // Get user device id
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
 * @param userAccessToken
 * @param autoClear
 * @param callback
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

Devices.prototype.getMessagesChat = function(data, userAccessToken, autoClear) {
    var dataJson = JSON.parse(data);
    if (dataJson.message == 'success') {
        if (dataJson.result.messages.length) {
            if (autoClear === undefined || autoClear === true) {
                var id_list = dataJson.result.messages.map(function (item) {
                    return item.UUID;
                });

                if(this.userDeviceId != null) {
                    var i = 0,
                        encodeddata;
                    for (i; i < id_list.length; i += 10) {
                        encodeddata = encodeURIComponent('["' + id_list.slice(i, i + 10).join('","') + '"]');
                        var url = this.apiURL + '/devices/messages?key=' + userAccessToken + '&messages=' + encodeddata + '&device_id=' + this.userDeviceId;
                        this.client.delete(url, {}, function (data, res) {
                            //console.log(JSON.parse(data))
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