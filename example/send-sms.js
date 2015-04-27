var apiKey = "API_KEY";
var domainApiSecret = "DOMAIN_API_SECRET";

var Kandy = require('../lib/kandy.js');
var kandy = new Kandy(apiKey, domainApiSecret);

// SMS params
var userId = "USER_ID";
var to  = "+1408*******";
var from  = "+1408*******";
var text = "Hello from Kandy";

kandy.sendSmS(userId, from, to, text);