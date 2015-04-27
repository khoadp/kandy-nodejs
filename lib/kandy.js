module.exports = function(apiKey, domainApiSecret) {

    this.apiKey = apiKey;
    this.domainApiSecret = domainApiSecret;

    this.sendSmS = function (userId, from, to, text) {
        // SMS params
        //var to = "+1408*******";
        //var from = "+1408*******";
        //var text = "Hello Kandy Nodejs";

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

        var userAccessToken = "";
        var userDeviceId = "";

        // Get user access token
        var userAccessTokenArgs = {
            parameters: {
                "key": apiKey,
                "domain_api_secret": domainApiSecret,
                "user_id": userId
            }
        };
// https://api.kandy.io/v1.2/domains/users/accesstokens?key=${key}&domain_api_secret=${domain_api_secret}&user_id=user1
        client.methods.getUserAccessToken(userAccessTokenArgs, function (data, response) {
            // {"result":{"user_access_token":"UAT19327bf040754bc591943be49f13e08c"},"status":0,"message":"success"}
            var dataJson = JSON.parse(data);

            if (dataJson.message == "success") {
                userAccessToken = dataJson.result.user_access_token;

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
                        client.methods.sendSms(smsArgs, function (data, response) {
                            var dataJson = JSON.parse(data);

                            if (dataJson.message == "success") {
                                console.log("Sent to " + to + ": " + text);
                            }

                        });

                    }
                });

            }
        });
    };

};