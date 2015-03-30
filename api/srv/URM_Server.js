"use strict";
/*eslint-env node */
var URMServer = function (newMsgFactory) {
    var msgFactory = newMsgFactory,
        server,
        db,
        keys,

        loadKeys = function () {
            keys = require("../data/keys");
        },

        validateApiKey = function (key) {
            if (keys.hasOwnProperty(key)) {
                return keys[key];
            } else {
                return undefined;
            }
        },

        init = function () {
            var express = require("express"),
                cors = require("cors"),
                bodyParser = require("body-parser");
            server = express();
            server.use(cors());
            server.use(bodyParser.json({
                strict: false
            }));
            server.use(bodyParser.urlencoded({
                extended: true
            }));


            server.get("/mensa", function (req, res) {
                res.redirect("http://132.199.139.24/~baa56852/www/mensa/");
            });

            server.post("/mensa/uni/upvote/*", function (req, res) {
                var id = req.originalUrl.substring(req.originalUrl.lastIndexOf("/") + 1, req.originalUrl.length),
                    apiUser = validateApiKey(req.body.key),
                    result = msgFactory.getErrorMessage("invalid api key");
                if (apiUser !== undefined) {
                    result = db.upvoteElement(parseInt(id));
                }
                res.send(JSON.stringify(result));
            });

            server.post("/mensa/uni/downvote/*", function (req, res) {
                var id = req.originalUrl.substring(req.originalUrl.lastIndexOf("/") + 1, req.originalUrl.length),
                    apiUser = validateApiKey(req.body.key),
                    result = msgFactory.getErrorMessage("invalid api key");
                if (apiUser !== undefined) {
                    result = db.downvoteElement(parseInt(id));
                }
                res.send(JSON.stringify(result));
            });

            server.get("/mensa/uni/*", function (req, res) {
                var day = req.originalUrl.substring(req.originalUrl.lastIndexOf("/") + 1, req.originalUrl.length),
                    menu = db.getMenuForDay(day);
                res.send(JSON.stringify(menu));
            });
        },

        start = function (port, database) {
            db = database;
            loadKeys();
            server.listen(port);
        },

        stop = function () {};

    init();

    return {
        start: start,
        stop: stop
    };
};


exports.Server = URMServer;