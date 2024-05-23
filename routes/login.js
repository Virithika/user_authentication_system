  const express = require('express');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const User = require('../models/user');
  const crypto = require('crypto');

  const router = express.Router();
  const secretKey = crypto.randomBytes(32).toString('hex');

  router.post('/', async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;
