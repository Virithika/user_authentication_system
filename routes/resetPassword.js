require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt'); 
const User = require('../models/user'); 

const router = express.Router();

router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required' });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
