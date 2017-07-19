const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('api-error-handler');
var swaggerTools = require('swagger-tools');
var YAML = require('yamljs');
var swaggerDoc = YAML.load('openapi.yaml');


const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Require our routes into the application.
require('./routes')(app);

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

app.use(errorHandler());



module.exports = app;