//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
var stringErrorScript;
var stringSuccessScript;
var stringHomeScript;

stringErrorScript = '<script type:="text/javascript">window.location.href="http://localhost:3000/failure.html"</script>';
stringSuccessScript = '<script type:="text/javascript">window.location.href="http://localhost:3000/success.html"</script>';
stringHomeScript = '<script type:="text/javascript">window.location.href="http://localhost:3000"</script>';

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var info = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };
  var data = {
    members: [{
      email_address: info.email,
      status: "subscribed",
      merge_fields: {
        FNAME: info.firstName,
        LNAME: info.lastName
      }
    }]
  };
  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/" + stringListID,
    method: "POST",
    headers: {
      "Authorization": "AnyString " + stringAPIKEY
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      }
    }
  });
});

// app.get("/success.html", function(req, res) {
//   res.sendFile(__dirname + "/");
// });

app.post("/success.html", function(req,res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Listening to Server on port 3000");
});
