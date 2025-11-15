const assert = require('assert');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

process.env.GOOGLE_CLIENT_ID = 'test_client_id';
process.env.GOOGLE_CLIENT_SECRET = 'test_client_secret';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

test('OAuth2Strategy requires a clientID option', () => {
    assert.strictEqual(typeof process.env.GOOGLE_CLIENT_ID, 'string');
});