require('dotenv').config();

    function pullAPI(){
        let apiKey = process.env.API_KEY;
        console.log(apiKey);
        let queryUrl = `https://api.trustpilot.com/v1/business-units/find?apikey=${apiKey}&name=trustpilot.com`
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
        });
    }

    pullAPI();

