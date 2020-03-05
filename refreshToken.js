var request = require("request");

require("dotenv").config();

let refreshToken = {
  getToken: token => {
    let options = {
      method: "POST",
      url:
        "https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/refresh",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        grant_type: "refresh_token",
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`,
        refresh_token: `${token}`
      }
    };

    let myFirstPromise = new Promise((resolve, reject) => {
      request(options, function(error, response) {
        if (error) {
          // console.log(error);
          reject(error);
        }
        resolve(response.body);
      });
    });

    return myFirstPromise.then(response => {
      console.log("\n\nin refresh token\n\n ");
      console.log(response);

      return JSON.parse(response);
    });
  }
};

module.exports = refreshToken;
