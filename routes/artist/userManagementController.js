const util = require('../../helpers/util');
const nodemailer = require("nodemailer");
const nodemailMailgun = require('nodemailer-mailgun-transport')
const jwt = require('jsonwebtoken')

const Artist = require('../../models/artist')

/**
 * Controller object
 */
const userManagement = {};

userManagement.login = async (req, res) => {
    let jsonRes;

    try {
        const username = req.body.username;
        const getArtist = await Artist.findOne({
            where: { username: username }
        })
        
        if(getArtist === null) {
            jsonRes = {
                statusCode: 401,
                success: false,
                message: 'Login credentials are invalid'
            };
        } else {
            const password = req.body.password;
            let salt = getArtist.salt
            const passwordHash = util.hashPassword(password, salt);

            if(passwordHash === getArtist.password) {
                let userDetails = {
                    artistId: getArtist.artistId,
                    username: getArtist.username,
                    email: getArtist.email,
                    name: getArtist.lastName + ', ' + getArtist.firstName
                };

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
                    message: 'Login credentials are invalid'
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

userManagement.userEnroll = async (req, res) => {

    let jsonRes;

    const salt = util.getSalt();
    const passwordHash = util.hashPassword(req.body.password, salt);
    
    try {
        let [, created] = await Artist.findOrCreate({
            where: { email: req.body.email },
            defaults: {
                username: req.body.username,
                email: req.body.email,
                password: passwordHash,
                salt: salt,
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                mobileNumber: req.body.mobileNumber,
                dateOfBirth: req.body.dateOfBirth,
                cityOfResidencePermanent: req.body.permanentAddress.city,
                provincePermanent: req.body.permanentAddress.province,
                regionPermanent: req.body.permanentAddress.region,
                cityOfResidenceCurrent: req.body.currentAddress.city,
                provinceCurrent: req.body.currentAddress.province,
                regionCurrent: req.body.currentAddress.region,
                socialMediaPage1: req.body.socialMediaPage1,
                socialMediaPage2: req.body.socialMediaPage2,
                socialMediaPage3: req.body.socialMediaPage3,
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
            jsonRes = {
                statusCode: 200,
                success: true,
                message: 'Artist enrolled successfully'
            };
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

userManagement.sendEmail = async (req, res) => {
    let jsonRes

    const getArtist = await Artist.findOne({
        where: { email: req.body.email },
        attributes: ['artistId', 'password']
    })

    if(!getArtist) {
        jsonRes = {
            statusCode: 400,
            success: false,
            error: 'Email does not exist'
        };
        util.sendResponse(res, jsonRes); 
    } else {
        const payload = {
            email: req.body.email,
            artistId: getArtist.artistId
        }

        const token = await jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRY})
    
        const link = `${process.env.HOST}:${process.env.PORT}/api/artist/forgot-password/${getArtist.artistId}/${token}`
        
        // NOTE: Mailtrap for temp email sending, to change to mailgun  
        // const auth = {
        //     auth: {
        //         api_key: process.env.MAILGUN_KEY,
        //         domain: process.env.MAILGUN_DOMAIN
        //     }
        // }
        // const transporter = await nodemailer.createTransport(nodemailMailgun(auth))
        const transporter = await nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "f775a828fcee7d",
              pass: "760c54c0f1026c"
            }
        });
            
        let info = {
            from: '"Husay.co" <sample@email.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "Husay.co Reset Password", // Subject line
            text: "Husay.co Reset Password", // plain text body
            html: `
            <h3> Good day, </h3>
            <p>You have requested a password reset to Husay.co from this account.
            To reset your password, please click the following link: <br /><br />
            <button type="button"><a href="${link}">Reset Password</a></button> <br /><br />
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

userManagement.verifyToken = async (req, res) => {
    let jsonRes;

    try { 
        // validate user id
        const getArtist = await Artist.findOne({
            where: { artistId: req.params.artistId },
            attributes: ['password', 'salt']
        })

        if(!getArtist) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Artist does not exist',
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

userManagement.resetPassword = async (req, res) => {
    let jsonRes;

    try { 
        // validate user id
        const getArtist = await Artist.findOne({
            where: { artistId: req.params.artistId },
            attributes: ['password', 'salt']
        })
        
        await jwt.verify(req.params.token, process.env.TOKEN_SECRET)
        
        // find user with the payload email & id
        const passwordHash = util.hashPassword(req.body.password, getArtist.salt);


        let updated = await Artist.update({password: passwordHash}, 
            {
                where: { artistId: req.params.artistId }
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

userManagement.changePassword = async (req, res) => {

    let jsonRes;
    
    try {
        let body = {}
        if(req.body.password) {
            const salt = util.getSalt();
            const passwordHash = util.hashPassword(req.body.password, salt);
            body.password = passwordHash
            body.salt = salt
        }

        let updated = await Artist.update(body, 
            {
                where: { artistId: req.params.artistId }
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

module.exports = userManagement;