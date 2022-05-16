const express = require('express');
const { route } = require('../health');

const authHandler = require('../../middlewares/authentication-handler');

const artist = require('./artistController');
const userManagement = require('./userManagementController')

const router = express.Router();

/**
 * Add routes
 */
router.post('/login', userManagement.login);
router.post('/add', userManagement.userEnroll);
router.post('/forgot-password', userManagement.sendEmail);
router.get('/forgot-password/:artistId/:token', userManagement.verifyToken);
router.post('/forgot-password/:artistId/:token', userManagement.resetPassword);
router.use(authHandler.authenticateUser);
router.put('/:artistId/change-password', userManagement.changePassword);
router.get('/:artistId', artist.getArtistProfile);
router.put('/:artistId', artist.editArtistProfile);
router.post('/:artistId', artist.addPortfolio);

module.exports = router;
