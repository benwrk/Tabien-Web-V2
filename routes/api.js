var express = require('express');
var router = express.Router();
var deleteAllowed = { 'vehicle': true, 'vehiclemodel': true, 'rating': true, 'reply': true, 'user': true };
var allowed = { 'vehicle': true, 'vehiclemodel': true, 'rating': true, 'reply': true, 'province': true, 'profile': true, 'user': true };

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
        if (allowed[req.params.element]) {
            var query = 'SELECT * FROM ' + req.params.element;
            console.log('[api.js] Querying: ' + query);
            pool.query(query, function (err, rows, fields) {
                if (!err) {
                    return res.json(rows);
                } else {
                    return res.send(err);
                }
            });
        } else {
            return res.status(404).send({
                message: 'Not found'
            });
        }
    });

    router.route('/:element/:id').get(function (req, res) {
        if (allowed[req.params.element]) {
            var query = 'SELECT * FROM ' + req.params.element + ' WHERE ' + req.params.element + '_id = ' + pool.escape(req.params.id);
            console.log('[api.js] Querying: ' + query);
            pool.query(query, function (err, rows, fields) {
                if (!err) {
                    return res.json(rows);
                } else {
                    return res.send(err);
                }
            });
        } else {
            return res.status(404).send({
                message: 'Not found'
            });
        }
    }).delete(function (req, res) {
        if (deleteAllowed[req.params.element]) {
            var query = 'DELETE FROM ' + req.params.element + ' WHERE ' + req.params.element + '_id = ' + pool.escape(req.params.id);
            console.log('[api.js] Querying: ' + query);
            pool.query(query, function (err, result) {
                if (!err) {
                    return res.json(result);
                } else {
                    return res.send(err);
                }
            });
        } else {
            if (allowed[req.params.element]) {
                return res.status(403).send({
                    message: 'Method now allowed!'
                });
            } else {
                return res.status(404).send({
                    message: 'Not found'
                });
            }

        }
    });

    // router.route('/user/:userid').get(function (req, res) {
    //     var query = 'SELECT * FROM user WHERE user_id = ' + pool.escape(req.params.userid);
    //     console.log('[api.js] Querying: ' + query);
    //     pool.query(query, function (err, rows, fields) {
    //         if (!err) {
    //             return res.json(rows);
    //         } else {
    //             return res.send(err);
    //         }
    //     });
    // });

    router.route('/:elementroot/:id/:element').get(function (req, res) {
        if (allowed[req.params.elementroot] && allowed[req.params.element]) {
            var query = 'SELECT * FROM ' + req.params.element + ' WHERE ' + req.params.elementroot + '_id = ' + pool.escape(req.params.id);
            console.log('[api.js] Querying: ' + query);
            pool.query(query, function (err, rows, fields) {
                if (!err) {
                    return res.json(rows);
                } else {
                    return res.send(err);
                }
            });
        } else {
            return res.status(404).send({
                message: 'Not found'
            });
        }
    });

    // router.route('/user/:userid/:element').get(function (req, res) {
    //     if (allowed[req.params.element]) {
    //         var query = 'SELECT * FROM ' + req.params.element + ' WHERE user_id = ' + pool.escape(req.params.userid);
    //         console.log('[api.js] Querying: ' + query);
    //         pool.query(query, function (err, rows, fields) {
    //             if (!err) {
    //                 return res.json(rows);
    //             } else {
    //                 return res.send(err);
    //             }
    //         });
    //     } else {
    //         return res.status(404).send({
    //             message: 'Not found'
    //         });
    //     }
    // });

    router.route('/vehicle').post(function (req, res) {
        var newVehicle = {
            vehiclemodel_id: req.body.vehiclemodel_id,
            user_id: req.body.user_id,
            province_id: req.body.province_id,
            first_block: req.body.first_block,
            second_block: req.body.second_block,
            color: req.body.color
        };
        var query = 'INSERT INTO vehicle SET ?';
        console.log('[api.js] Querying: ' + query);
        pool.query(query, newVehicle, function (err, result) {
            if (!err) {
                return res.send(result);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/vehicle/:vehicleid').put(function (req, res) {
        var newVehicle = {
            vehiclemodel_id: req.body.vehiclemodel_id,
            user_id: req.body.user_id,
            province_id: req.body.province_id,
            first_block: req.body.first_block,
            second_block: req.body.second_block,
            color: req.body.color
        };
        var query = 'UPDATE vehicle SET ? WHERE vehicle_id = ' + pool.escape(req.params.vehicleid);
        console.log('[api.js] Querying: ' + query);
        pool.query(query, newVehicle, function (err, result) {
            if (!err) {
                return res.send(result);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/rating/:ratingid').put(function (req, res) {
        var newRating = {
            vehicle_id: req.body.vehicle_id,
            user_id: req.body.user_id,
            rate: req.body.rate,
            message: req.body.message,
            timestamp: Date.now()
        };
        var query = 'UPDATE rating SET ? WHERE rating_id = ' + pool.escape(req.params.ratingid);
        console.log('[api.js] Querying: ' + query);
        pool.query(query, newRating, function (err, result) {
            if (!err) {
                return res.send(result);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/reply/:replyid').put(function (req, res) {
        var newReply = {
            user_id: req.body.user_id,
            rating_id: req.body.rating_id,
            message: req.body.message,
            timestamp: Date.now()
        };
        var query = 'UPDATE reply SET ? WHERE reply_id = ' + pool.escape(req.params.replyid);
        console.log('[api.js] Querying: ' + query);
        pool.query(query, newReply, function (err, result) {
            if (!err) {
                return res.send(result);
            } else {
                return res.send(err);
            }
        });
    });

    router.route('/profile/:profileid').put(function (req, res) {
        var newProfile = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            location: req.body.location,
            email: req.body.email,
            user_id: req.body.user_id
        };
        var query = 'UPDATE profile SET ? WHERE profile_id = ' + pool.escape(req.params.profileid);
        console.log('[api.js] Querying: ' + query);
        pool.query(query, newProfile, function (err, result) {
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
