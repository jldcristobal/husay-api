const util = require('../../helpers/util');
const nodemailer = require("nodemailer");
const nodemailMailgun = require('nodemailer-mailgun-transport')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')
const Artist = require('../../models/artist')

/**
 * Controller object
 */
const userEnrollment = {};

userEnrollment.userEnroll = async (req, res) => {

    let jsonRes;

    const salt = util.getSalt();
    const passwordHash = util.hashPassword(req.body.password, salt);
    
    try {
        let [usr, created] = await User.findOrCreate({
            where: { email: req.body.email },
            defaults: {
                role: req.body.role,
                username: req.body.username,
                email: req.body.email,
                password: passwordHash,
                salt: salt,
                createdAt: new Date()
            }
        })

        if(!created) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Email already exists'
            };
        } else {
            if(req.body.role == 1) { // if admin
                // insert admin info
            } else if(req.body.role == 2 && req.body.artistProfile) { // if artist
                let artistBody = req.body.artistProfile
                artistBody.userId = usr.userId
                artistBody.createdAt = new Date()
                let [artst, created] = await Artist.findOrCreate({
                    where: { userId: artistBody.userId },
                    defaults: artistBody
                })

                if(!created) {
                    jsonRes = {
                        statusCode: 400,
                        success: false,
                        message: 'Artist already exists'
                    };
                } else {
                    jsonRes = {
                        statusCode: 200,
                        success: true,
                        message: 'Artist enrolled successfully'
                    };
                }
            } else {
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    message: 'User enrolled successfully'
                }; 
            }
        }
    } catch(error) {
        jsonRes = {
            statusCode: 500,
            success: false,
            error: error,
        };
    }
    util.sendResponse(res, jsonRes);    
};

userEnrollment.sendEmail = async (req, res) => {
    let jsonRes

    const getUser = await User.findOne({
        where: { email: req.body.email },
        attributes: ['userId', 'password']
    })

    if(!getUser) {
        jsonRes = {
            statusCode: 400,
            success: false,
            error: 'Email does not exist'
        };
        util.sendResponse(res, jsonRes); 
    } else {
        const payload = {
            email: req.body.email,
            userId: getUser.userId
        }

        const token = await jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRY})
    
        const link = `${process.env.HOST}:${process.env.PORT}/api/user/forgot-password/${getUser.userId}/${token}`
        
        // send email thru mailgun
        const auth = {
            auth: {
                api_key: process.env.MAILGUN_KEY,
                domain: process.env.MAILGUN_DOMAIN
            }
        }
            
        const transporter = await nodemailer.createTransport(nodemailMailgun(auth))
            
        let info = {
            from: '"Husay.co" <sample@email.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "Husay.co Reset Password", // Subject line
            text: "Husay.co Reset Password", // plain text body
            html: `
            <h3> Good day, </h3>
            <p>You have requested a password reset to Husay.co from this account.
            To reset your password, please click the following link: <br /><br />
            <button type="button"><a href="${link}">Reset Password</a></button> <br />
            If the button is not working, you may also copy and paste this link to the browser: <br /><br />
            <a href="${link}">${link}</a> <br /><br />
            This link will expire in 1 hour. <br /><br />
            </p>` // html body
        }

        // mask email
        const email = req.body.email.split('@')
        let maskedEmail = email[0].charAt(0)
        for (let index = 1; index < email[0].length - 1; index++) {
            const element = email[0][index];
            maskedEmail += '*'
        }
        maskedEmail += email[0].slice(-1) + '@' + email[1]
        
        await transporter.sendMail(info, (err, info) => {
            if(err) {
                jsonRes = { 
                    statusCode: 500,
                    success: false,
                    message: 'Email not sent',
                    error: err
                };
                util.sendResponse(res, jsonRes); 
            } else {
                jsonRes = {
                    statusCode: 200,
                    success: true,
                    message: "Password reset link sent to " + maskedEmail,
                    result: {
                        messageId: info.messageId
                    }
                };
                util.sendResponse(res, jsonRes); 
            }
        })
    }
}

userEnrollment.verifyToken = async (req, res) => {
    let jsonRes;

    try { 
        // validate user id
        const getUser = await User.findOne({
            where: { userId: req.params.userId },
            attributes: ['password', 'salt']
        })

        if(!getUser) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'User does not exist',
            };
        } else {
            const payload = await jwt.verify(req.params.token, process.env.TOKEN_SECRET)
            
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Token verified'
            };
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
}

userEnrollment.resetPassword = async (req, res) => {
    let jsonRes;

    try { 
        // validate user id
        const getUser = await User.findOne({
            where: { userId: req.params.userId },
            attributes: ['password', 'salt']
        })
        
        await jwt.verify(req.params.token, process.env.TOKEN_SECRET)
        
        // find user with the payload email & id
        const passwordHash = util.hashPassword(req.body.password, getUser.salt);


        let updated = await User.update({password: passwordHash}, 
            {
                where: { userId: req.params.userId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Password reset failed'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: "Password reset successfully"
            }; 
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
}

userEnrollment.changePassword = async (req, res) => {

    let jsonRes;
    
    try {
        let body = {}
        if(req.body.password) {
            const salt = util.getSalt();
            const passwordHash = util.hashPassword(req.body.password, salt);
            body.password = passwordHash
            body.salt = salt
        }

        let updated = await User.update(body, 
            {
                where: { userId: req.params.userId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Password cannot be updated'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: "Password updated successfully"
            }; 
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

module.exports = userEnrollment;