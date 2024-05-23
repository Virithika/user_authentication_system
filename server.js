require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8005;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/user-authentication', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const passwordResetRequest = require('./routes/passwordResetRequest');
const resetPassword = require('./routes/resetPassword');

// Use routes
app.use('/requestPasswordReset', passwordResetRequest);
app.use('/resetPassword', resetPassword);
app.use('/register', registerRoute);
app.use('/login', loginRoute);

// Server-start
app.listen(port, () => {
  console.log("Server is listening to port " + port);
});
