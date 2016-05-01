var express = require('express');
var router = express.Router();

module.exports = function (query) {
    // router.use(function (req, res, next) {
    //     console.log('[api.js] Verifying authentication for connection from: ' + req.ip);
    //     res.setHeader('cache-control', 'max-age=0');
    //     if (req.method === "GET") {
    //         // console.log('[api.js] GET connection passthrough: ' + req.ip);
    //         return next();
    //     }

    //     if (!req.isAuthenticated()) {
    //         // console.log('[api.js] \'' + req.ip + '\' is not logged in, redirecting...');
    //         return res.redirect('/#/login');
    //     }

    //     // console.log('[api.js] \'' + req.ip + '\' is authenticated, proceeding...');
    //     return next();
    // });

    router.route('/query').post(function (req, res) {
        console.log('[api.js] Querying...');
        query('SELECT * FROM user;', function (err, result) {
            if (!err) {
                console.log('[api.js] Query result: ');
                console.log(result);
                return res.json(result);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/profile').get(function (req, res) {
        query('SELECT * FROM profile', function (err, result) {
            if (!err) {
                return res.json(result.rows);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/profile/:userid').get(function (req, res) {
        query('SELECT * FROM profile WHERE user_id = ' + query.escape(req.params.userid), function (err, result) {
            if (!err) {
                return res.json(result.rows);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/vehicle').get(function (req, res) {
        query('SELECT * FROM vehicle', function (err, result) {
            if (!err) {
                return res.json(result.rows);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/vehicle/:vehicleid').get(function (req, res) {
        query('SELECT * FROM vehicle WHERE vehicle_id = ' + query.escape(req.params.vehicleid), function (err, result) {
            if (!err) {
                return res.json(result.rows);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/posts/:id').get(function (req, res) {

    }).put(function (req, res) {

    }).delete(function (req, res) {

    });
    return router;
};
