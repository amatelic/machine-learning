var express = require('express');
var classifier = require('./span/naivebayes');
var bodyParser = require('body-parser');
var db = require('./span/db');
var app = express();
var NaiveBayes = new classifier.NaiveBayes(classifier.getWords);

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

function check(title, content) {
  var category = ['new'];
  var state = NaiveBayes.classify(content);
  if (state === 'bad') {
    category.push('span');
    NaiveBayes.train(content, 'bad');
  } else {
    NaiveBayes.train(content, 'true');
  }

  return {
    title,
    content,
    category,
    date: new Date(),
  };
}

var mails = [];
console.log(NaiveBayes);
app.get('/', function(req, res) {
  res.json({conten: 'Site is on development'});
});

app.get('/new', function(req, res) {
  res.json(mails);
  mails = [];
});

app.post('/new_mail', function(req, res) {
  let {title, content} = req.body;
  mails.push(check(title, content));
  res.json({status: 200});
});

app.listen(5000);
