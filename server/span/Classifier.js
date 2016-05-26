var Classifier = require('./naivebayes');
var db = require('./db');
var NaiveBayes = new Classifier.NaiveBayes(Classifier.getWords);
var categoryArray = ['new'];

function trainClassifier(classifier, data) {
  Object.keys(data).forEach(d => {
    Object.keys(data[d]).forEach(text => {
      classifier.train(data[d][text], d);
    });
  });
}

function copy(array) {
  return Array.prototype.slice.call(array);
}

function addCategories(list) {
  var categories = copy(categoryArray);
  return categories.concat(list);
}

function check(content) {
  let category = categoryArray;
  var state = NaiveBayes.classify(content);
  console.log(state)
  if (state === 'bad') {
    category = addCategories(['spam']);
    NaiveBayes.train(content, 'bad');
  } else {
    NaiveBayes.train(content, 'true');
  }

  return category;
}

//Starting classifier
trainClassifier(NaiveBayes, db);

module.exports = {
  predictCategories: check,
};
