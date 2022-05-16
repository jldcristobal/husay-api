const util = require('../../helpers/util');

const Artist = require('../../models/artist');
const ArtistPortfolio = require('../../models/artist_portfolios');

/**
 * Controller object
 */
const artist = {};

artist.getArtistProfile = async (req, res) => {

    let jsonRes;
    
    try {
        let artistList = await Artist.findByPk(req.params.artistId || res.locale.user.artistId, {
            attributes: { exclude: ['email', 'password', 'salt', 'createdAt', 'updatedAt'] }
        });

        if(artistList.length === 0) {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: null,
                message: 'Artist not found'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                result: artistList
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

artist.editArtistProfile = async (req, res) => {

    let jsonRes;
    
    try {
        let updated = await Artist.update(
            { 
                firstName: req.body.firstName,
                middleName: req.body.middleName,
                lastName: req.body.lastName,
                mobileNumber: req.body.mobileNumber,
                dateOfBirth: req.body.dateOfBirth,
                cityOfResidencePermanent: req.body.cityOfResidencePermanent,
                provincePermanent: req.body.provincePermanent,
                regionPermanent: req.body.regionPermanent,
                cityOfResidenceCurrent: req.body.cityOfResidenceCurrent,
                provinceCurrent: req.body.provinceCurrent,
                regionCurrent: req.body.regionCurrent,
                socialMediaPage1: req.body.socialMediaPage1,
                socialMediaPage2: req.body.socialMediaPage2,
                socialMediaPage3: req.body.socialMediaPage3,
                updatedAt: new Date()
            }, {
                where: { artistId: req.params.artistId }
            }
        ) 

        if(updated == 0) {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'Artist profile cannot be updated'
            };
        } else {
            jsonRes = {
                statusCode: 200,
                success: true,
                message: "Artist profile updated successfully"
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

artist.addPortfolio = async (req, res) => {

    let jsonRes;

    try { 
        let filename
        if(req.files) {
            for (let i=0; i < req.files.length; i++) {
                let file = req.files[i]
                let name = file.name
                let fileExtension = mime.extension(file.mimetype);
        
                filename = util.createRandomString(name.length)
                filename += '.' + fileExtension
                
                let path = `uploads/portfolio/${req.params.artistId}/${filename}`
                file.mv(path);

                let created = await Artist.create({
                    artistId: req.params.artistId,
                    filename: filename
                })
        
                if(!created) {
                    jsonRes = {
                        statusCode: 400,
                        success: false,
                        message: 'Could not bulk update faculty dependent information'
                    };
                } else {
                    
                    jsonRes = {
                        statusCode: 200,
                        success: true,
                        message: 'Faculty dependent information updated successfully'
                    }; 
                }
            } 
            
        } else {
            jsonRes = {
                statusCode: 400,
                success: false,
                message: 'No image attached'
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

module.exports = artist;