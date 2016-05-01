var express = require('express');
var router = express.Router();
var allowDelete = ['vehicle', 'vehiclemodel', 'rating', 'reply'];

module.exports = function (pool) {
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

    // router.route('/query').post(function (req, res) {
    //     console.log('[api.js] Querying...');
    //     pool.query('SELECT * FROM user;', function (err, result) {
    //         if (!err) {
    //             console.log('[api.js] Query result: ');
    //             console.log(result);
    //             return res.json(result);
    //         } else {
    //             return res.send(err);
    //         }
    //     });
    // });

    router.route('/:element').get(function (req, res) {
        pool.query('SELECT * FROM ' + pool.escape(req.params.element), function (err, rows, fields) {
            if (!err) {
                return res.json(rows);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/:element/:id').get(function (req, res) {
        pool.query('SELECT * FROM ' + pool.escape(req.params.element) + ' WHERE ' + pool.escape(req.params.element) + '_id = ' + pool.escape(req.params.id), function (err, rows, fields) {
            if (!err) {
                return res.json(rows);
            } else {
                return res.send(err);
            }
        });
    }).delete(function (req, res) {
        if (allowDelete[req.params.element]) {
            pool.query('DELETE FROM ' + pool.escape(req.params.element) + ' WHERE ' + pool.escape(req.params.element) + '_id = ' + pool.escape(req.params.id), function (err, result) {
                if (!err) {
                    return res.json(rows);
                } else {
                    return res.send(err);
                }
            });
        } else {
            return res.status(403).send({
                message: 'Method now allowed!'
            });
        }    
    });

    router.route('/user/:userid').get(function (req, res) {
        pool.query('SELECT * FROM user WHERE user_id = ' + pool.escape(req.params.userid), function (err, rows, fields) {
            if (!err) {
                return res.json(rows);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/user/:userid/:property').get(function (req, res) {
        pool.query('SELECT * FROM ' + pool.escape(req.params.property) + ' WHERE user_id = ' + pool.escape(req.params.userid), function (err, rows, fields) {
            if (!err) {
                return res.json(rows);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/vehicle').post(function (req, res) {
        var newVehicle = {
            vehiclemodel_id: req.body.vehiclemodel_id,
            user_id: req.body.user_id,
            province_id: req.body.province_id,
            first_block: req.body.first_block,
            second_block: req.body.second_block,
            color: req.body.color
        };
        console.log(newVehicle);
        pool.query('INSERT INTO vehicle SET ?', newVehicle, function (err, result) {
            if (!err) {
                return res.send(result);
            } else {
                return res.send(err);
            }
        });
    });


    router.route('/rating').post(function (req, res) {
        var newRating = {
            vehicle_id: req.body.vehicle_id,
            user_id: req.body.user_id,
            rate: req.body.rate,
            message: req.body.message,
            timestamp: Date.now()
        };
        console.log(newVehicle);
        pool.query('INSERT INTO rating SET ?', newRating, function (err, result) {
            if (!err) {
                return res.send(result);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/vehiclemodel').post(function (req, res) {
        var newVehicleModel = {
            brand: req.body.brand,
            make: req.body.make
        };
        console.log(newVehicle);
        pool.query('INSERT INTO vehiclemodel SET ?', newVehicleModel, function (err, result) {
            if (!err) {
                return res.send(result);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/reply').post(function (req, res) {
        var newReply = {
            user_id: req.body.user_id,
            rating_id: req.body.rating_id,
            message: req.body.message,
            timestamp: Date.now()
        };
        console.log(newReply);
        pool.query('INSERT INTO reply SET ?', newReply, function (err, result) {
            if (!err) {
                return res.send(result);
            } else {
                return res.send(err);
            }
        });
    });

    return router;
};
