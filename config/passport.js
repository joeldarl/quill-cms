const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const users = mongoose.model('users');

passport.use('login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, async (email, password, done) => {
    try {
        const user = await users.findOne({ email });
        if( !user ){
            return done(null, false, { message : 'User not found'});
        }
        const validate = await user.validatePassword(password);
        if( !validate ){
            return done(null, false, { message : 'Wrong Password'});
        }
        return done(null, user, { message : 'Logged in Successfully'});
    } catch (error) {
        return done(error);
    }
}));