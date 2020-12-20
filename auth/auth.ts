const jwt = require('express-jwt/lib');
import { Request } from 'express';

const getTokenFromHeaders = (req : Request) => {
    const { headers: { authorization } } = req;

    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const secret : any = process.env.JWT_SECRET;

const auth = {
    required: jwt({
        secret: secret,
        userProperty: 'payload',
        algorithms: ['HS256'],
        getToken: (req : Request) => {
            if(req.cookies.auth)
            {
                return req.cookies.auth;
            }
        }
    }),
    optional: jwt({
        secret: secret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256'],
        credentialsRequired: false,
    }),
};

module.exports = auth;