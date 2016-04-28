// Passport initialization JS.
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var users = {};

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        // Tell passport which id to use for user
        console.log('[passport.js] Serializing user: ', user.username);
        return done(null, user.username);
    });

    passport.deserializeUser(function (username, done) {
        return done(null, users[username]);
    });

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {
        if (!users[username]) {
            return done('illegal username', false);
        }
        if (!isValidPassword(users[username], password)) {
            return done('invalid password', false);
        }
        // Successfully logged in
        console.log('[passport.js] User: ' + username + ' successfully logged in');
        return done(null, users[username]);
    }));

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {
        // Check if user already exists
        if (users[username]) {
            return done('username already exists', false);
        }

        // Add user to database
        users[username] = {
            username: username,
            password: createHash(password)
        };

        return done(null, users[username]);
    }));

    var isValidPassword = function (user, password) {
        return bcrypt.compareSync(password, user.password);
    };

    var createHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    };
};