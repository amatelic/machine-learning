var express = require('express');
var Classifier = require('./span/Classifier');
var bodyParser = require('body-parser');
var user_mails = require('./span/mails');
var BasicResponses = require('./json-respones');
var app = express();
var count = 4;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var mails = [];
app.get('/', function(req, res) {
  res.json({conten: 'Site is on development'});
});

app.get('/new', function(req, res) {
  res.json({mails:mails});
  mails = [];
});

app.get('/mails', function(req, res) {
  res.json({
    page: 1,
    mails: user_mails.mails,
  });
});

app.get('/searche', function(req, res) {
  let q = req.query.q;
  res.json({results: [
    'data',
    'test',
    'bla',
  ],});
});

app.post('/new_mail', function(req, res) {
  let {title, content} = req.body;
  let userResponse = BasicResponses.createResponse('Mail {condition} send.',
  [title, content]);
  if (content) {
    let category = Classifier.predictCategories(content);
    mails.push({id: ++count, title, content, category, date: new Date()});
  }

  res.json(userResponse);

});

app.listen(5000);
