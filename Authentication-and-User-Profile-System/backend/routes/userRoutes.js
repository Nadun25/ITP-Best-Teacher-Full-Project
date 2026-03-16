const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    changePassword,
    deleteUserAccount,
    changePasswordValidation,
    profileValidation
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

// All routes are protected and require a user to log in
router.use(protect);

router.route('/profile')
    .get(getUserProfile)
    .put(profileValidation, validateRequest, updateUserProfile);

router.put('/change-password', changePasswordValidation, validateRequest, changePassword);

router.delete('/delete-account', deleteUserAccount);

module.exports = router;
