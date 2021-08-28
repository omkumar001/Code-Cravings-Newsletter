const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const FirstName = req.body.Fname;
  const lastName = req.body.Lname;
  const email = req.body.Email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: FirstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/((List_Id))";
  const options = {
    method: "POST",
    auth: "omkumar01:API_Key", //for authentication using {username:password(API key)}
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      //console.log(JSON.parse(data));
    });
  });

  request.write(jsonData); //Sending actual data to the MailChimp Server
  request.end();

  console.log(FirstName, lastName, email);
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

//When deployed insted of 3000 we use process.env.PORT
app.listen(process.env.PORT || 3000, function () {
  console.log("Port 3000 is successfullly connected to the server !!!");
});
