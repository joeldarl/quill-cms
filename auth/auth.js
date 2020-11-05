const jwt = require('express-jwt/lib');
const jwtSecret = require('../config/secret.json');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;

    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const auth = {
    required: jwt({
        secret: jwtSecret.secret,
        userProperty: 'payload',
        algorithms: ['HS256'],
        getToken: (req) => {
            if(req.cookies.auth)
            {
                return req.cookies.auth;
            }
        }
    }),
    optional: jwt({
        secret: jwtSecret.secret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256'],
        credentialsRequired: false,
    }),
};

module.exports = auth;