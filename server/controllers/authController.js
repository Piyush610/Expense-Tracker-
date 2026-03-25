const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Setup 2FA (Generate QR Code)
const setup2FA = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const secret = speakeasy.generateSecret({ 
    issuer: 'ExpenseIQ',
    name: `ExpenseIQ:${user.email}` 
  });
  
  // Save secret
  user.twoFactorSecret = secret.base32;
  await user.save();

  // MANUALLY CONSTRUCT URL for 100% compatibility
  // format: otpauth://totp/ISSUER:LABEL?secret=SECRET&issuer=ISSUER
  const label = encodeURIComponent(`ExpenseIQ:${user.email}`);
  const issuer = encodeURIComponent('ExpenseIQ');
  const otpAuthUrl = `otpauth://totp/${label}?secret=${secret.base32}&issuer=${issuer}`;

  const qrImageUrl = await QRCode.toDataURL(otpAuthUrl);
  res.json({ qrCode: qrImageUrl, secret: secret.base32 });
});

// @desc    Verify and Enable 2FA
const verify2FA = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user._id);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token
  });

  if (verified) {
    user.twoFactorEnabled = true;
    await user.save();
    res.json({ success: true, message: '2FA enabled successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid verification code');
  }
});

// @desc    Auth user & get token (Login)
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Only trigger if explicitly true (legacy users will be undefined/false)
    if (user.twoFactorEnabled === true) {
      return res.json({ pending2FA: true, email: user.email });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      twoFactorEnabled: !!user.twoFactorEnabled,
      preferences: user.preferences,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Verify 2FA Token for Login
const login2FA = asyncHandler(async (req, res) => {
  const { email, token } = req.body;
  
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid email');
  }

  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    res.status(400);
    throw new Error('2FA is not properly configured for this user');
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token
  });

  if (verified) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled,
      preferences: user.preferences,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid 2FA code');
  }
});

// @desc    Register a new user
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      twoFactorEnabled: false,
      preferences: user.preferences,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      twoFactorEnabled: !!user.twoFactorEnabled,
      preferences: user.preferences,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update User Preferences
const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.preferences = {
      ...user.preferences,
      ...req.body,
    };

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update User Profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.twoFactorEnabled === false) {
      user.twoFactorEnabled = false;
      user.twoFactorSecret = undefined;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      twoFactorEnabled: !!updatedUser.twoFactorEnabled,
      preferences: updatedUser.preferences,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  register,
  login,
  getMe,
  updatePreferences,
  updateProfile,
  setup2FA,
  verify2FA,
  login2FA
};
