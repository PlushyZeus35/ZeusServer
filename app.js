const express = require('express');
const path = require('path')

// INITIALIZATIONS
const app = express();


// SETTINGS
// Set static path to serve static files
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('trust proxy', true);

// TEMPLATE ENGINE

// MIDDLEWARES

// GLOBAL VARIABLES

// ROUTES
app.use(require('./routes'));
app.use(require('./routes/index'));
app.use('/auth', require('./routes/auth'))


module.exports = app;