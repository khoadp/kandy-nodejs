# Nodejs module for Kandy

This Nodejs module encapsulates Kandy Restful APIs. Kandy is a product by GENBAND (www.genband.com) that utilizes WebRTC to enable peer to peer audio and video calls and chat.

With this module, you can send SMS to a number. We are working on video, audio call, chat, ...

Home page: http://www.kandy.io/

## Installation

$ npm install kandy

## Usages

### Get User Access Token

```javascript
var apiKey = "API_KEY"; // Get from kandy.io
var userId = "USER_ID"; // Get from kandy.io
var password = "USER_PASSWORD"; // Get from kandy.io

var kandy = new Kandy(apiKey);

kandy.getUserAccessToken(userId, password, function (data, response) {
        var dataJson = JSON.parse(data);
        console.log(dataJson);
    });
});

```

### Send SMS

```javascript
var userAccessToken = "USER_ACCESS_TOKEN"; // Get from kandy.getUserAccessToken(...)

var from = "+1-408-475-****"; // Optional
var to = "+1-408-475-****"; // Required
var text = "Hello from Kandy"; // Required

var kandy = new Kandy();

kandy.sendSms(userAccessToken, from, to, text, function (data, response) {
      var dataJson = JSON.parse(data);
      if (dataJson.message == "success") {
          console.log("Sent to " + to + ": " + text);
      }
});

```

### Send Message

```javascript
var userAccessToken = "USER_ACCESS_TOKEN"; // Get from kandy.getUserAccessToken(...)

var to = "user2@domain.com"; // Required
var text = "Hello from Kandy"; // Required

var kandy = new Kandy();

kandy.sendIm(userAccessToken, to, text, function (data, response) {
      var dataJson = JSON.parse(data);
      if (dataJson.message == "success") {
          console.log("Sent to " + to + ": " + text);
      }
});

```

### Get Messages

```javascript
var userAccessToken = "USER_ACCESS_TOKEN"; // Get from kandy.getUserAccessToken(...)

var autoClear = true; // Clear messages after receiving so that next call won't show those messages

var kandy = new Kandy();

kandy.getIm(userAccessToken, autoClear, function (data, response) {
      var dataJson = JSON.parse(data);
      console.log(dataJson);
});

```

### Get Addressbook

```javascript
var userAccessToken = "USER_ACCESS_TOKEN"; // Get from kandy.getUserAccessToken(...)

var kandy = new Kandy();

kandy.getAddressbook(userAccessToken, function (data, response) {
      var dataJson = JSON.parse(data);
      console.log(dataJson);
});

```

### Get Domain Access Token

```javascript
var apiKey = "API_KEY"; // Get from kandy.io
var domainApiSecret = "DOMAIN_API_SECRET"; // Get from kandy.io

var kandy = new Kandy(apiKey, domainApiSecret);

kandy.getDomainAccessToken(function (data, response) {
      var dataJson = JSON.parse(data);
      console.log(dataJson);
});

```

### Get List Users

```javascript
var domainAccessToken = "DOMAIN_ACCESS_TOKEN"; // Get from kandy.getDomainAccessToken(...)

var kandy = new Kandy();

kandy.getListUsers(domainAccessToken, function (data, response) {
      var dataJson = JSON.parse(data);
      console.log(dataJson);
});

```
