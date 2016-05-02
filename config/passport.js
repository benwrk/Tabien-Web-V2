var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport, pool) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('[passport.js] Serializing user: ', user.username);
        return done(null, user.user_id);
    });

    passport.deserializeUser(function (id, done) {
        pool.query('SELECT * FROM user WHERE user_id = ' + pool.escape(id), function (err, rows, fields) {
            if (err) {
                console.log('[passport.js] Error deserializing user.');
                return done(err, false);
            }

            var user = rows[0];

            if (!user) {
                console.log('[passport.js] Error: Cannot deserialize -- User not found for id: ' + id);
                return done('User not found', false);
            }

            return done(null, user);
        });
    });

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {

        // User.findOne({
        //     'username': username
        // }, function (err, user) {
        //     if (err) {
        //         console.log('[passport.js] Error in database connection while logging in \'' + username + '\':');
        //         console.log(err);
        //         return done(err, false);
        //     }

        //     if (!user) {
        //         console.log('[passport.js] login - User \'' + username + '\' does not exist in the database');
        //         return done('User ' + username + ' not found', false);
        //     }

        //     if (!isValidPassword(user, password)) {
        //         console.log('[passport.js] login - Password for \'' + username + '\' does not match what\'s in the database');
        //         return done('Invalid password for user ' + username, false);
        //     }

        //     console.log('[passport.js] Successfully logged in: ' + username);
        //     return done(null, user);
        // });
        pool.query('SELECT * FROM user WHERE username = ' + pool.escape(username), function (err, rows, fields) {
            if (err) {
                console.log('[passport.js] Error: login - Query problem!');
                return done(err, false);
            }

            var user = rows[0];

            if (!user) {
                console.log('[passport.js] Error: login - \'' + username + '\' does not exist!');
                return done('User ' + username + ' not found', false);
            }


            if (!isValidPassword(user, password)) {
                console.log('[passport.js] Error: login - Password for \'' + username + '\' does not match what\'s in the database');
                return done('Invalid password for user ' + username, false);
            }

            console.log('[passport.js] Success: login - \'' + username + '\' logged in.');
            return done(null, user);
        });
    }));

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {
        // Check if user already exists
        // User.findOne({
        //     'username': username
        // }, function (err, user) {
        // if (err) {
        //     console.log('[passport.js] Error in database connection when signing up for: ' + username);
        //     console.log(err);
        //     return done(err, false);
        // }

        // if (user) {
        //     console.log('[passport.js] Attempt to signup \'' + username + '\' failed: Username already exists.');
        //     return done('username already exists', false);
        // }
        // // Add user to database
        // var newUser = new User();
        // newUser.username = username;
        // newUser.password = createHash(password);

        // newUser.save(function (err, user) {
        //     if (err) {
        //         console.log('[passport.js] Error in saving new user: ' + username);
        //         return done(err, false);
        //     }
        //     console.log('[passport.js] Successfully signed up: ' + username);
        //     return done(null, user);
        // });
        pool.query('SELECT * FROM user WHERE username = ' + pool.escape(username), function (err, rows, fields) {
            if (err) {
                console.log('[passport.js] Error querying (0)');
                return done(err, false);
            }

            var user = rows[0];

            if (user) {
                console.log('[passport.js] Attempt to signup \'' + username + '\' failed: Username already exists.');
                return done('username already exists', false);
            }

            var newUser = {
                username: username,
                password: createHash(password)
            };

            pool.query('INSERT INTO user SET ?', newUser, function (err, result) {
                if (err) {
                    console.log('[passport.js] Error querying (1)');
                    return done(err, false);
                }
                // console.log(result);
                pool.query('SELECT * FROM user WHERE username =' + pool.escape(username), function (err, rows, fields) {
                    if (err) {
                        console.log('[passport.js] Error querying (2)');
                        return done(err, false);
                    }

                    var user = rows[0];

                    if (!user) {
                        console.log('[passport.js] Error: User does not exist after registration error.');
                        return done('unknown error', false);
                    }
                    var newProfile = {
                        firstname: req.body.profile.firstname,
                        lastname: req.body.profile.lastname,
                        location: req.body.profile.location,
                        email: req.body.profile.email,
                        user_id: user.user_id
                    };

                    if (!(newProfile.firstname && newProfile.lastname && newProfile.location && newProfile.email && newProfile.user_id)) {
                        console.log('[passport.js] Error: cannot find required user profile arguments.');
                        return done('Unidentified object exist in user profile', false);
                    }
                    pool.query('INSERT INTO profile SET ?', newProfile, function (err, result) {
                        if (err) {
                            console.log('[passport.js] Error querying (3)');
                            pool.query('DELETE FROM user WHERE user_id = ' + pool.escape(user_id), function (err, results) {
                                console.log('[passport.js] Error creating user profile, deleting created user object...');
                                if (err) {
                                    console.log('[passport.js] Error querying (4), fatal: User \'' + user_id + '\' existed without any profile.');
                                    return done(err, false);
                                }
                                return done('Error creating user profile', false);
                            });
                            return done(err, false);
                        } else {
                            console.log('[passport.js] Successfully signed up: ' + username);
                            return done(null, user);
                        }
                    });
                });
            });
        });
        // });
    }));

    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};

