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
