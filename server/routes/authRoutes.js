const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePreferences, updateProfile, setup2FA, verify2FA, login2FA } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);
router.put('/profile', protect, updateProfile);

// 2FA Routes
router.get('/2fa/setup', protect, setup2FA);
router.post('/2fa/verify', protect, verify2FA);
router.post('/2fa/login', login2FA);

module.exports = router;
