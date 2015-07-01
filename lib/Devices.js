var Utils  = require('./Utils'),
    utils  = new Utils();

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

/**
 * Send a message.
 * @param userAccessToken
 * @param to
 * @param text
 * @param callback
 */
Devices.prototype.sendIm = function (userAccessToken, to, text, callback) {
    // Get user device id
    var userDeviceArgs = {
        parameters: {
            key: userAccessToken
        }
    };

    this.client.methods.getUserDevice(userDeviceArgs, (function (data, response) {
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
            this.client.methods.sendIm(messageArgs, callback);
        }
    }).bind(this));
};

/**
 * Get pending messages.
 * @param userAccessToken
 * @param autoClear
 * @param callback
 */
Devices.prototype.getIm = function (userAccessToken, autoClear, callback) {
    // Get user device id
    var userDeviceArgs = {
        parameters: {
            key: userAccessToken
        }
    };

    this.client.methods.getUserDevice(userDeviceArgs, (function (data, response) {
        var dataJson = JSON.parse(data);

        if (dataJson.message == 'success') {
            var userDeviceId = dataJson.result.devices[0].id;
            var messageArgs = {
                parameters: {key: userAccessToken, device_id: userDeviceId},
                headers: {'Content-Type': 'application/json'}
            };
            this.client.methods.getIm(messageArgs, (function (data, res) {
                var dataJson = JSON.parse(data);
                if (dataJson.message == 'success') {
                    if (dataJson.result.messages.length) {

                        if (autoClear === undefined || autoClear === true) {
                            var id_list = dataJson.result.messages.map(function (item) {
                                return item.UUID;
                            });

                            var i = 0,
                                encodeddata;
                            for (i; i < id_list.length; i += 10) {
                                encodeddata = encodeURIComponent('["' + id_list.slice(i, i + 10).join('","') + '"]');
                                var url = this.apiURL + '/devices/messages?key=' + userAccessToken + '&messages=' + encodeddata + '&device_id=' + userDeviceId;

                                this.client.delete(url, {}, function (data, res) {
                                    //console.log(JSON.parse(data))
                                });
                            }
                        }
                    }
                }
                callback(data, res);
            }).bind(this));
        }
    }).bind(this));
};

module.exports = Devices;