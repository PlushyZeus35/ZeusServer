const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// INITIALIZATIONS
const app = express();


// SETTINGS
// Set static path to serve static files
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Error-handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ status: false, error: 'Bad JSON' }); // Bad JSON
    }
    next();
});
app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('trust proxy', true);

// TEMPLATE ENGINE

// MIDDLEWARES

// GLOBAL VARIABLES

// ROUTES
app.use(require('./routes'));
app.use(require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/finance', require('./routes/finance'));

module.exports = app;