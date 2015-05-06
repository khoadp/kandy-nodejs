var Kandy = require('./lib/kandy');

// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});

app.get('/getUserAccessToken', function (request, response) {
    var apiKey = request.query.apiKey;
    var userId = request.query.userId;
    var password = request.query.password;

    if (typeof apiKey == "undefined" || apiKey == ''
        || typeof userId == "undefined" || userId == ''
        || typeof password == "undefined" || password == '') {
        response.send('{"message":"API Key, User Id and Password are required"}');
        return;
    }

    var kandy = new Kandy(apiKey);

    kandy.getUserAccessToken(userId, password, function (data, res) {
        var dataJson = JSON.parse(data);
        response.send(dataJson);
    });

});

app.get('/sms', function (request, response) {
    var userAccessToken = request.query.userAccessToken;
    var from = request.query.from;
    var to = request.query.to;
    var text = request.query.text;

    if (typeof userAccessToken == "undefined" || userAccessToken == ''
        || typeof to == "undefined" || to == ''
        || typeof text == "undefined" || text == '') {
        response.send('{"message":"User Access Token, To and Text are required"}');
        return;
    }

    var kandy = new Kandy();

    kandy.sendSms(userAccessToken, from, to, text, function (data, res) {
        var dataJson = JSON.parse(data);
        if (dataJson.message == "success") {
            console.log("Sent to " + to + ": " + text);
        }
        response.send(dataJson);
    });

});