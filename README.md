# Nodejs module for Kandy

This Nodejs module encapsulates Kandy Restful APIs. Kandy is a product by GENBAND (www.genband.com) that utilizes WebRTC to enable peer to peer audio and video calls and chat. SMS and PSTN calling support will be added to this module in the near future.

With this module, you can send SMS to a number. We are working on video, audio call, chat, ...

Home page: http://www.kandy.io/

## Installation

$ npm install kandy

## Usages

### Send SMS

Client has 2 ways to call a REST service: direct or using registered methods

```javascript
var apiKey = "API_KEY"; // Get from kandy.io
var domainApiSecret = "DOMAIN_API_SECRET"; // Get from kandy.io

var Kandy = require('../lib/kandy.js');
var kandy = new Kandy(apiKey, domainApiSecret);

// SMS params
var userId = "USER_ID"; // Get from kandy.io
var to  = "+1408*******";
var from  = "+1408*******";
var text = "Hello from Kandy";

kandy.sendSmS(userId, from, to, text);

```
