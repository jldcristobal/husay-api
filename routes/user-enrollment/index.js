const express = require('express');

const userEnrollmentController = require('./userEnrollmentController');
const authHandler = require('../../middlewares/authentication-handler');

const router = express.Router();

/**
 * Add routes
 */
router.post('/add', userEnrollmentController.userEnroll);
router.post('/forgot-password', userEnrollmentController.sendEmail);
router.get('/forgot-password/:userId/:token', userEnrollmentController.verifyToken);
router.post('/forgot-password/:userId/:token', userEnrollmentController.resetPassword);
router.use(authHandler.authenticateUser);
router.put('/:userId/change-password', userEnrollmentController.changePassword);

module.exports = router;
