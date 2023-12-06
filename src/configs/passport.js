var LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt")

const AuthenService = require(`${__path_services}backend/account_service`);
const notify = require(`${__path_configs}notify`)

module.exports = (passport) => {
    passport.use(new LocalStrategy((username, password, done) => {
        AuthenService.findOne(username).then(async (user) => {
            // // User not found
            if (!user) {
                return done(null, false,{ message: notify.ERROR_LOGIN_USERNAME_NOTEXIST })
            }
        
            // // Always use hashed passwords and fixed time comparison
            await bcrypt.compare(password, user.password, function(err, result) {
                if (err) {
                    return done(err)
                }
                if (!result) {
                    // return done(null, false, { message: notify.ERROR_LOGIN_PASSWORD_INCORRECT })
                    console.log(result)
                }
                return done(null, user)
            })
        })
     }
   ))

   passport.serializeUser(function(user, done) {
    done(null, user._id)
   })

   passport.deserializeUser(function(id, done) {
    AuthenService.findItem(id).then((user) => {
        done(null, user)
    })
   })
};