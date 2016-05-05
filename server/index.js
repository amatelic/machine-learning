var express = require('express');
var classifier = require('./span/naivebayes');
var app = express();
var NaiveBayes = new classifier.NaiveBayes(classifier.getWords);
function sampletrain(cl) {
  cl.train('Buy some free drugs its good.', 'bad');
  cl.train('Have sex with loot of girls.', 'bad');
  cl.train('Get viagra for better sex.', 'bad');
  cl.train('Hi time should we go playings', 'good');
  cl.train('Hi you are a good friend', 'good');
  cl.train('Skavti danes ob 10 uri dobimo se pred skavtsko', 'skavts');
  // cl.train('Skavti danes ob 10 uri dobimo se pred skavtsko', 'skavts');
  // cl.train('Skavti danes ob 10 uri dobimo se pred skavtsko', 'skavts');
}

sampletrain(NaiveBayes);
console.log(NaiveBayes.classify('you are a good friend'));
console.log(NaiveBayes.classify('playing sex game'));
console.log(NaiveBayes.classify('good friend'));
console.log(NaiveBayes.classify('have some good viagra with some good drugs'));

app.get('/', function(req, res) {
  res.json({a: 1});
});

app.listen(5000);
