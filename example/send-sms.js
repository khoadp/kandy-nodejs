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
