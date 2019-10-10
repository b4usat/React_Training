const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pingResponse = require('./pingResponse.json');
const eventsResult = require('./eventsMessage.json');
const ePayEligible = require('./ePayEligible.json');
const completeConversion = require('./completeConversion.json');
const getUser = require('./getUser.json');
const siteHealth = require('./siteHealth.json')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/ping', (req, res) => {
  setTimeout(function () {
    res.json(pingResponse);
  }, 1000);
});

app.post('/api/mytbi/eligibility', (req, res) => {
  setTimeout(function () {
    res.json(ePayEligible);
  }, 1000);
});

app.get('/api/auth/users/current', (req, res) => {
  setTimeout(function () {
    res.json(getUser);
  }, 1000);
});

app.get('/api/sitehealth', (req, res) => {
  setTimeout(function () {
    res.json(siteHealth);
  }, 1000);
});


app.post('/api/mytbi/conversion', (req, res) => {
  setTimeout(function () {
    res.json(completeConversion);
  }, 1000);
});

app.post('/api/v1/events', (req, res) => {

  setTimeout(function () {
    res.json(eventsResult);
  }, 1000);
});

const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
  console.log(`Mock service listening on http://localhost:3000`);
});

module.exports.stop = () => {
  httpServer.close();
};
