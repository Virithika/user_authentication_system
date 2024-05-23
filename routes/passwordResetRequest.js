const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user'); 
const router = express.Router();

router.use(cors());
router.use(express.json());

router.post('/', async (req, res) => {
  console.log('Received request to reset password');

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generating a unique token using UUID
    const resetToken = uuidv4();

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "uauthentication3",
        pass: "zlje diil haxm ajse",
      },
    });

    const resetLink = `http://localhost:3000/resetPassword/${resetToken}`;

    const mailOptions = {
      from: "uauthentication3@gmail.com",
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Please click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send password reset email' });
      }
      console.log('Password reset email sent:', info.response);
      res.status(200).json({ message: 'Password reset email sent. Check your email inbox.' });
    });
  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to handle GET request for password reset
router.get('/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      //  no user found with the provided token / the token is expired
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Error handling password reset GET request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
