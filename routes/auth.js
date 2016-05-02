var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    router.get('/success', function (req, res) {
        console.log('[auth.js] GET /success');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send({
            state: 'success',
            user: req.user ? req.user : null
        });
    });

    router.get('/failure', function (req, res) {
        console.log('[auth.js] GET /failure');
        res.send({
            state: 'failure',
            user: null,
            message: 'Authentication failure'
        });
    });

    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));
    
    router.get('/signout', function(req, res) {
        console.log('[auth.js] User \'' + req.user + '\' logging out');
        req.logout();
        res.redirect('/');
    });
    
    return router;
};