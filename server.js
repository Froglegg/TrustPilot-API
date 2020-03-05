require("dotenv").config();
const refresh = require("./refreshToken");
// for getting initial access token... run getAccessToken.getToken("TOKENHERE"). Look in file to view instructions on getting first Access Code.
const getAccessToken = require("./getAccessToken");
const getReviews = require("./getReviews");
const express = require("express");
const wakeUpDyno = require("./wakeUpDyno"); // wakes up Heroku free tier dyno every 25 minutes, basically so the refresh tokens don't expire. We'll have to really think through how we implement refresh tokens on our servers...

let PORT = process.env.PORT || 3000;
const DYNO_URL = "https://trust-pilot-api.herokuapp.com"; // the url of heroku dyno

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let hbsObject;

// getAccessToken.getToken("TdfdgCXC");

const initiateAPI = () => {
  console.log("initializing");
  try {
    // this
    refresh
      .getToken(`${process.env.FIRST_REFRESH_TOKEN}`)
      .then(firstResponse => {
        console.log("\n\nin controller\n\n");
        var newToken = firstResponse.refresh_token;
        console.log(newToken);
        getReviews.all(firstResponse.access_token, function(data) {
          data = data
            .filter(el => {
              // return only results with "sendToAPI" as the first tag
              // TODO: Make it so that the trustpilot admin can include this tag in any order
              return el.tags.length && el.tags[0].value == "sendToAPI";
            })
            .map(el => {
              // get only the values we want
              let obj = {
                title: el.title,
                createdAt: el.createdAt,
                // create new array of stars based on number of stars, which we will iterate over in the front end and create star icons with
                stars: new Array(parseInt(el.stars)).fill(0),
                text: el.text,
                tags: el.tags
              };
              return obj;
            });

          // sort in descending order, aka 5,4,3,2,1 stars
          data.sort((a, b) =>
            a.stars < b.stars ? 1 : b.stars < a.stars ? -1 : 0
          );

          console.log(data);
          hbsObject = {
            data: data
          };

          return hbsObject;
        });

        setInterval(() => {
          try {
            refresh.getToken(newToken).then(response => {
              console.log(response);
              newToken = response.refresh_token;
              try {
                getReviews.all(response.access_token, function(data) {
                  console.log("sucessfully got data");
                  data = data
                    .filter(el => {
                      // return only results with "sendToAPI" as the first tag
                      // TODO: Make it so that the trustpilot admin can include this tag in any order
                      return el.tags.length && el.tags[0].value == "sendToAPI";
                    })
                    .map(el => {
                      // get only the values we want
                      let obj = {
                        title: el.title,
                        createdAt: el.createdAt,
                        // create new array of stars based on number of stars, which we will iterate over in the front end and create star icons with
                        stars: new Array(parseInt(el.stars)).fill(0),
                        text: el.text,
                        tags: el.tags
                      };
                      return obj;
                    });

                  // sort in descending order, aka 5,4,3,2,1 stars
                  data.sort((a, b) =>
                    a.stars < b.stars ? 1 : b.stars < a.stars ? -1 : 0
                  );

                  console.log(data);
                  hbsObject = {
                    data: data
                  };

                  return hbsObject;
                });
              } catch (error) {
                hbsObject = {
                  error: error
                };
                return hbsObject;
              }
            });
          } catch (error) {
            hbsObject = {
              error: error
            };
            return hbsObject;
          }
        }, 250000);
      });
  } catch (error) {
    hbsObject = {
      error: error
    };

    return hbsObject;
  }
};

initiateAPI();

app.get("/", function(req, res) {
  res.render("index", hbsObject);
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  wakeUpDyno(DYNO_URL);
  // Log (server-side) when our server has started
  console.log("Server listening on: " + PORT);
});
