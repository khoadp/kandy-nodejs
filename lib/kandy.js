module.exports = function(apiKey) {

    this.apiKey = apiKey;

    // API configuration
    var apiHost = "https://api.kandy.io";
    var version = "v1.2";
    var apiURL = apiHost + "/" + version;

    var Client = require('node-rest-client').Client;
    var client = new Client();

    // registering remote methods
    client.registerMethod("getUserAccessToken", apiURL + "/domains/users/accesstokens", "GET");
    client.registerMethod("getUserDevice", apiURL + "/users/devices", "GET");
    client.registerMethod("sendSms", apiURL + "/devices/smss", "POST");

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
                userDeviceId = dataJson.result.devices[0].id;
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
};