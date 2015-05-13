module.exports = function (apiKey, domainApiSecret) {

    this.apiKey = apiKey;
    this.domainApiSecret = domainApiSecret;

    // API configuration
    var apiHost = "https://api.kandy.io";
    var version = "v1.1";
    var apiURL = apiHost + "/" + version;

    var Client = require('node-rest-client').Client;
    var client = new Client();

    // registering remote methods
    client.registerMethod("getUserAccessToken", apiURL + "/domains/users/accesstokens", "GET");
    client.registerMethod("getDomainAccessToken", apiURL + "/domains/accesstokens", "GET");
    client.registerMethod("getUserDevice", apiURL + "/users/devices", "GET");
    client.registerMethod("sendSms", apiURL + "/devices/smss", "POST");
    client.registerMethod("getAddressbook", apiURL + "/users/addressbooks/personal", "GET");
    client.registerMethod("sendIm", apiURL + "/devices/messages", "POST");
    client.registerMethod("getIm", apiURL + "/devices/messages", "GET");
    client.registerMethod("getListUsers", apiURL + "/domains/users", "GET");

    var guid = function () {
        var s = [],
            itoh = '0123456789ABCDEF';

        // Make array of random hex digits. The UUID only has 32 digits in it, but we
        // allocate an extra items to make room for the '-'s we'll be inserting.
        for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);

        // Conform to RFC-4122, section 4.4
        s[14] = 4; // Set 4 high bits of time_high field to version
        s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence

        // Convert to hex chars
        for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];

        // Insert '-'s
        s[8] = s[13] = s[18] = s[23] = '-';

        return s.join('');
    };

    this.getUserAccessToken = function (userId, password, callback) {
        // Get user access token
        var userAccessTokenArgs = {
            parameters: {
                "key": this.apiKey,
                "user_id": userId,
                "user_password": password
            }
        };

        client.methods.getUserAccessToken(userAccessTokenArgs, callback);
    };

    this.getDomainAccessToken = function (callback) {
        // Get domain access token
        var domainAccessTokenArgs = {
            parameters: {
                "key": this.apiKey,
                "domain_api_secret": this.domainApiSecret
            }
        };

        client.methods.getDomainAccessToken(domainAccessTokenArgs, callback);
    };

    this.getListUsers = function (domainAccessToken, callback) {
        // Get list users
        var listUsersArgs = {
            parameters: {
                "key": domainAccessToken
            }
        };

        client.methods.getListUsers(listUsersArgs, callback);
    };

    this.sendSms = function (userAccessToken, from, to, text, callback) {

        // Get user device id
        var userDeviceArgs = {
            parameters: {
                "key": userAccessToken
            }
        };

        //https://api.kandy.io/v1.2/users/devices?key=${key}
        client.methods.getUserDevice(userDeviceArgs, function (data, response) {
            var dataJson = JSON.parse(data);

            if (dataJson.message == "success") {
                var userDeviceId = dataJson.result.devices[0].id;
                // Send sms
                var smsArgs = {
                    data: {
                        message: {
                            destination: to,
                            source: from,
                            message: {
                                "text": text
                            }
                        }
                    },
                    parameters: {key: userAccessToken, device_id: userDeviceId},
                    headers: {"Content-Type": "application/json"}
                };
                //https://api.kandy.io/v1.2/devices/smss?key=${key}&device_id=${device_id}
                client.methods.sendSms(smsArgs, callback);
            }
        });
    };

    this.sendIm = function (userAccessToken, to, text, callback) {

        // Get user device id
        var userDeviceArgs = {
            parameters: {
                "key": userAccessToken
            }
        };

        client.methods.getUserDevice(userDeviceArgs, function (data, response) {
            var dataJson = JSON.parse(data);

            if (dataJson.message == "success") {
                var userDeviceId = dataJson.result.devices[0].id;
                // Send sms
                var messageArgs = {
                    data: {
                        message: {
                            contentType: "text",
                            destination: to,
                            UUID: guid(),
                            message: {
                                mimeType: "text/plain",
                                text: text
                            }
                        }
                    },
                    parameters: {key: userAccessToken, device_id: userDeviceId},
                    headers: {"Content-Type": "application/json"}
                };
                client.methods.sendIm(messageArgs, callback);
            }
        });
    };

    this.getAddressbook = function (userAccessToken, callback) {
        // Get user device id
        var args = {
            parameters: {
                "key": userAccessToken
            },
            headers: {"Content-Type": "application/json"}
        };
        client.methods.getAddressbook(args, callback);
    };

    this.getIm = function (userAccessToken, autoClear, callback) {

        // Get user device id
        var userDeviceArgs = {
            parameters: {
                "key": userAccessToken
            }
        };

        client.methods.getUserDevice(userDeviceArgs, function (data, response) {
            var dataJson = JSON.parse(data);

            if (dataJson.message == "success") {
                var userDeviceId = dataJson.result.devices[0].id;
                var messageArgs = {
                    parameters: {key: userAccessToken, device_id: userDeviceId},
                    headers: {"Content-Type": "application/json"}
                };
                client.methods.getIm(messageArgs, function (data, res) {
                    var dataJson = JSON.parse(data);
                    if (dataJson.message == "success") {
                        if (dataJson.result.messages.length) {

                            if (autoClear === undefined || autoClear === true) {
                                var id_list = dataJson.result.messages.map(function (item) {
                                    return item.UUID;
                                });

                                var i = 0,
                                    encodeddata;
                                for (i; i < id_list.length; i += 10) {
                                    encodeddata = encodeURIComponent('["' + id_list.slice(i, i + 10).join('","') + '"]');
                                    var url = apiURL + '/devices/messages?key=' + userAccessToken + '&messages=' + encodeddata + '&device_id=' + userDeviceId;

                                    client.delete(url, {}, function (data, res) {
                                        //console.log(JSON.parse(data))
                                    });
                                }
                            }
                        }
                    }
                    callback(data, res);
                });
            }
        });
    };
};