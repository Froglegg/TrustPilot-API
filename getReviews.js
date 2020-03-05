const axios = require("axios");
require("dotenv").config();

// Make a request for a user with a given ID

let getReviews = {
  all: (accessToken, callBack) => {
    let unitId = process.env.UNIT_ID;
    let queryUrl = `https://api.trustpilot.com/v1/private/business-units/${unitId}/reviews?token=${accessToken}`;
    // console.log(queryUrl);
    axios
      .get(queryUrl)
      .then(function(response) {
        // handle success
        callBack(response.data.reviews);
      })
      .catch(function(error) {
        // handle error
        callBack(error);
      });
  }
};

module.exports = getReviews;

// https://api.trustpilot.com/v1/private/business-units/[YOUR BUSINESS UNIT ID]/reviews?token=[YOUR ACCESS TOKEN]
