const express = require('express'),
      app = express(),
      port = process.env.PORT || 3000,
      mongoose = require('mongoose'),
      bodyParser = require('body-parser');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/meditrack');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./routes');
routes(app);

app.listen(port);

console.log('API is live!');
