var apiKey = "API_KEY"; // Get from kandy.io
var domainApiSecret = "DOMAIN_API_SECRET"; // Get from kandy.io
var userId = "USER_ID"; // Get from kandy.io

var Kandy = require('../lib/kandy.js');
var kandy = new Kandy(apiKey, domainApiSecret, userId);

// SMS params
var to  = "+1408*******";
var from  = "+1408*******";
var text = "Hello from Kandy";

kandy.sendSmS(from, to, text);