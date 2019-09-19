var express = require("express");

var router = express.Router();

var model = require("./model.js");

// router.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/index.html'));
// });

router.get("/", function(req, res) {
    model.all(function(data) {
        var hbsObject = {
            data: data
        };
        // console.log(hbsObject);
        res.render("index", hbsObject);
    });
});

// router.get('/api/', function(req, res) {
//     res.json(res);
// });

module.exports = router;