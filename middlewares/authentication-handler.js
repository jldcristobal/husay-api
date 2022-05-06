const config = require('config');
const jwt = require('jsonwebtoken');
const util = require('../helpers/util');

/**
 * auth Handler object
 */
const authHandler = {};


/**
 * auth handler function
 */
authHandler.authenticateUser = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        jsonRes = {
            errors: [{
                code: 401,
                message: 'No token provided.'
            }],
            statusCode: 401
        };
        util.sendResponse(res, jsonRes);
    } else {
        token = token.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
            if (err) { 
                jsonRes = {
                    errors: [{
                        code: 401,
                        message: 'User unauthorized'
                    }],
                    statusCode: 401
                };
                util.sendResponse(res, jsonRes);
            } else {
                res.locals.user = decoded;
                next();
            }
        });
    }
};

module.exports = authHandler;