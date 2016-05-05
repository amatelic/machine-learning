'use strict';

function getWords(doc) {
  return doc.split(/\s+/)
    .filter(w => w.length > 2 && w.length < 20)
    .map(w => w.toLowerCase().replace(/[.!?]/, ''));
}

class Classifier {
  constructor(getfeatures, filename) {
    this.fc = {};
    this.cc = {};
    this.getfeatures = getfeatures;
  }

  //Increase the count of a feature/category pair
  incf(f, cat) {
    if (!this.fc[f]) {
      this.fc[f] = {};
    }

    if (!this.fc[f][cat]) {
      this.fc[f][cat] = 0;
    }

    this.fc[f][cat] += 1;
  }

  incc(cat) {
    if (!this.cc[cat]) {
      this.cc[cat] = 0;
    }

    this.cc[cat] += 1;
  }

  fcount(f, cat) {
    if (this.isUndefined(f, cat)) {
      return this.fc[f][cat];
    }

    return 0.0;
  }

  isUndefined(f, cat) {
    return (this.fc[f] !== undefined) && (this.fc[f][cat] !== undefined)
  }

  catcount(cat) {
    if (this.cc[cat]) {
      return this.cc[cat];
    }
    return 0;
  }

  totalCount() {
    return Object.values(this.cc).reduce(sum);
  }

  categories() {
    return Object.keys(this.cc);
  }

  train(item, cat) {
    let features = this.getfeatures(item);
    for (let f of features) {
      this.incf(f, cat);
    }
    this.incc(cat);
  }

  fprob(f, cat) {
    if (this.catcount(cat) === 0) return 0;

    return this.fcount(f, cat) / this.catcount(cat);
  }

  weightedprob(f, cat, prf, weight, ap) {
    var weight = weight || 1.0;
    var ap = ap || 0.5;
    let basicprob = prf.call(this, f, cat);
    let totals = this.categories()
        .map((c) => this.fcount(f, c))
        .reduce(sum, 0);

    return ((weight * ap) + (totals * basicprob)) / (weight + totals);

  }

}

function sum(a, b) {
  return a + b;
}

class NaiveBayes extends Classifier {
  constructor(getfeatures) {
    super(getfeatures);
    this.thresholds = {};
  }

  setTreshold(cat, t) {
    this.thresholds[cat] = t;
  }

  getTreshold(cat) {
    return this.thresholds[cat];
  }

  classify(item, df) {
    var best;
    var df = df || null;
    let probs = {};
    let max = 0.0;
    for (let cat of this.categories()) {
      probs[cat] = this.prob(item, cat);
      if (probs[cat] > max) {
        max = probs[cat];
        best = cat;
      }
    }

    for (var cat in probs) {
      if (cat === best) continue;
      if (probs[cat] * this.getTreshold(best) > probs[best]) {
        return df;
      }
    }

    return best;
  }

  docprob(item, cat) {
    let features = this.getfeatures(item);

    //Multiplay the probabilities of all the features together
    let p = 1;
    for (let f of features) {
      p *= this.weightedprob(f, cat, this.fprob);
    }

    return p;
  }

  prob(item, cat) {
    let catprob = this.catcount(cat) / this.totalCount();
    let docprob = this.docprob(item, cat);
    return docprob * catprob;
  }
}

class FisherClassifier extends Classifier {
  constructor(getfeatures) {
    super(getfeatures);
    this.minimums = {};
  }

  setMinimum(cat, min) {
    this.minimums[cat] = min;
  }

  getMinimum(cat) {
    if (!this.minimums[cat]) {
      return 0;
    }

    return this.minimums[cat];
  }

  classify(item, df) {
    let best = df;
    let max = 0.0;
    let p;
    for (let cat of this.categories()) {
      p = this.fisherprob(item, cat);
      if (p > this.getMinimum(cat) && p > max) {
        best = cat;
        max = p;
      }
    }

    return best;
  }

  cprob(f, cat) {
    let clf = this.fprob(f, cat);
    if (clf === 0) return 0;
    let freqsum = this.categories()
        .map((c) => this.fprob(f, c))
        .reduce(sum, 0);

    return clf / (freqsum);
  }

  fisherprob(item, cat) {
    let p = 1;
    let features = this.getfeatures(item);
    for (let f of features) {
      p *= this.weightedprob(f, cat, this.cprob);
    }

    let fscore = -2 * Math.log10(p);
    return this.invchi2(fscore, features.length * 2);
  }

  invchi2(chi, df) {
    let m = chi / 2.0;
    let term = Math.exp(-m);
    let sum = term;
    for (var i = 1; i < (df / 2); i++) {
      term *= m / 1;
      sum += term;
    }

    return Math.min(sum, 1.0);
  }
}

module.exports = {
  FisherClassifier,
  NaiveBayes,
  getWords,
};
