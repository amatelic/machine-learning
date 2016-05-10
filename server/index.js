var express = require('express');
var classifier = require('./span/naivebayes');
var bodyParser = require('body-parser');
var db = require('./span/db');
var user_mails = require('./span/mails');
var app = express();
var NaiveBayes = new classifier.NaiveBayes(classifier.getWords);
var count = 4;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

Object.keys(db).forEach(d => {
  Object.keys(db[d]).forEach(text => {
    NaiveBayes.train(db[d][text], d);
  });
});

function check(title, content, count) {
  var category = ['new'];
  var state = NaiveBayes.classify(content);
  if (state === 'bad') {
    category.push('span');
    NaiveBayes.train(content, 'bad');
  } else {
    NaiveBayes.train(content, 'true');
  }

  return {
    id: count,
    title,
    content,
    category,
    date: new Date(),
  };
}

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

app.post('/new_mail', function(req, res) {
  let {title, content} = req.body;
  mails.push(check(title, content, count++));
  res.json({status: 200});
});

app.listen(5000);
