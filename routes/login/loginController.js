const jwt = require('jsonwebtoken');

const util = require('../../helpers/util');

const User = require('../../models/user')
const Artist = require('../../models/artist')

/**
 * Controller object
 */
const login = {};

login.login = async (req, res) => {
    let jsonRes;

    try {
        const username = req.body.username;
        const getUser = await User.findOne({
            where: { username: username }
        })
        
        if(getUser === null) {
            jsonRes = {
                statusCode: 401,
                success: false,
                message: 'User credentials are invalid'
            };
        } else {
            const password = req.body.password;
            let salt = getUser.salt
            const passwordHash = util.hashPassword(password, salt);

            if(passwordHash === getUser.password) {
                let userDetails = {
                    username: getUser.username,
                    email: getUser.email,
                    role: getUser.role,
                    userId: getUser.userId,
                };
                
                if(getUser.role == 2) { // if artist
                    let artist = await Artist.findOne({
                        where: { userId: getUser.userId },
                        attributes: ['artistId', 'lastName', 'firstName']
                    })
                    
                    if(artist != null) {
                        userDetails.artistId = artist.artistId
                        userDetails.name = artist.lastName + ', ' + artist.firstName
                    }
                } else if(getUser.role == 1) { // if admin
                }

                // generate token
                let token = jwt.sign(userDetails, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRY }); 

                jsonRes = {
                    statusCode: 200,
                    success: true,
                    result: {
                        token
                    }
                };

            } else {
                jsonRes = {
                    statusCode: 401,
                    success: false,
                    message: 'User credentials are invalid'
                };
            }
        }
    } catch(error) {
        jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
        };
    } finally {
        util.sendResponse(res, jsonRes); 
    }
};

module.exports = login;