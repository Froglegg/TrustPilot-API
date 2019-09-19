const axios = require('axios');
 
// Make a request for a user with a given ID

let model = {
    all: (callBack)=> {
        let apiKey = process.env.API_KEY;
        let unitId = process.env.UNIT_ID;
        let accessToken = process.env.ACCESS_TOKEN;
        console.log(apiKey);
        let queryUrl = `https://api.trustpilot.com/v1/private/business-units/${unitId}/reviews?token=${accessToken}`;
        // console.log(queryUrl);
        axios.get(queryUrl)
        .then(function (response) {
          // handle success
          console.log(response.data.reviews);
          callBack(response.data.reviews);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    }
}

module.exports = model;

// https://api.trustpilot.com/v1/private/business-units/[YOUR BUSINESS UNIT ID]/reviews?token=[YOUR ACCESS TOKEN]


