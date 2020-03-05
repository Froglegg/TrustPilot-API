var request = require("request");
require("dotenv").config();

let accessToken = {
  getToken: async code => {
    let options = {
      method: "POST",
      url:
        "https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/accesstoken",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      form: {
        grant_type: "authorization_code",
        // code will change; in order to get code go to https://authenticate.trustpilot.com?client_id=process.env.CLIENT_ID&redirect_uri=process.env.REDIRECT_URI&response_type=code in browser
        code: `${code}`,
        redirect_uri: `${process.env.REDIRECT_URI}`,
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.API_SECRET}`
      }
    };

    let response = await request(options, function(error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      return response.body;
    });

    return response;
  }
};

module.exports = accessToken;
