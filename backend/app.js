const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('api-error-handler');


const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require our routes into the application.
require('./routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

app.use(errorHandler());

module.exports = app;