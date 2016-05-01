var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('[passport.js] Serializing user: ', user.username);
        return done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
        // User.findById(id, function (err, user) {
        //     if (err) {
        //         return done(err, false);
        //     }

        //     if (!user) {
        //         return done('User not found', false);
        //     }

        //     return done(null, user);
        // });
    });

	passport.use('login', new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {

        User.findOne({
            'username': username
        }, function (err, user) {
            if (err) {
                console.log('[passport.js] Error in database connection while logging in \'' + username + '\':');
                console.log(err);
                return done(err, false);
            }

            if (!user) {
                console.log('[passport.js] login - User \'' + username + '\' does not exist in the database');
                return done('User ' + username + ' not found', false);
            }

            if (!isValidPassword(user, password)) {
                console.log('[passport.js] login - Password for \'' + username + '\' does not match what\'s in the database');
                return done('Invalid password for user ' + username, false);
            }
            
            console.log('[passport.js] Successfully logged in: ' + username);
            return done(null, user);
        });
    }));

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {
        // Check if user already exists
        User.findOne({
            'username': username
        }, function (err, user) {
            if (err) {
                console.log('[passport.js] Error in database connection when signing up for: ' + username);
                console.log(err);
                return done(err, false);
            }

            if (user) {
                console.log('[passport.js] Attempt to signup \'' + username + '\' failed: Username already exists.');
                return done('username already exists', false);
            }
            
             // Add user to database
            var newUser = new User();
            newUser.username = username;
            newUser.password = createHash(password);

            newUser.save(function (err, user) {
                if (err) {
                    console.log('[passport.js] Error in saving new user: ' + username);
                    return done(err, false);
                }
                console.log('[passport.js] Successfully signed up: ' + username);
                return done(null, user);
            });
        });
    }));
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};

