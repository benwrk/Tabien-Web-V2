var express = require('express');
var router = express.Router();

module.exports = function (passport) {
    router.get('/success', function (req, res) {
        console.log('[auth.js] GET /success');
        var ans = {
            state: 'success',
            user: req.user ? req.user : null
        };
        console.log('[auth.js] Response:');
        console.log(ans);
        res.json(ans);
    });

    router.get('/failure', function (req, res) {
        console.log('[auth.js] GET /failure');
        var ans = {
            state: 'failure',
            user: null,
            message: 'Authenticaltion failure'
        }
        console.log('[auth.js] Response:');
        console.log(ans);
        res.json(ans);
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