function sum(obj) {
  return Object.keys(obj)
  .reduce(function(sum, key) {
    return sum + parseFloat(obj[key]);
  }, 0);
}

class DecisonTree {
  constructor({col = -1, value = null, results = null, tb = null, fb = null} = {}) {
    this.col = col;
    this.value = value;
    this.results = results;
    this.tb = tb;
    this.fb = fb;
  }
}

function devideSet(rows, column, value) {
  let splitFunction;
  if (!isNaN(parseFloat(value))) {
    splitFunction = (row) => row[column] >= value;
  } else {
    splitFunction = (row) => row[column] === value;
  }

  let set1 = [];
  let set2 = [];

  for (var row of rows) {
    if (splitFunction(row)) {
      set1.push(row);
    } else {
      set2.push(row);
    }
  }

  return [set1, set2];
}

function uniquecounts(rows, dd) {
  let results = {};
  for (let row of rows) {
    let r = row[row.length - 1];
    if (!results[r]) {
      results[r] = 0;
    }

    results[r] += 1;
  };

  return results;
}

function  giniimpurity(rows) {
  let total = rows.length;
  let count = uniquecounts(rows);
  let imp = 0;
  for (k1 of Object.keys(count)) {
    let p1 = count[k1] / total;
    for (k2 of Object.keys(count)) {
      if (k1 === k2) continue;
      let p2 = count[k2] / total;
      imp += p1 * p2;
    }
  }

  return imp;
}

function entropy(rows) {
  let {log2} = Math;
  let total = rows.length;
  let results = uniquecounts(rows);
  let ent = 0;
  for (r of Object.keys(results)) {
    let p = results[r] / total;
    ent -= p * log2(p);
  }

  return ent;
}

function buildTree(rows, scoref) {
  if (rows.length === 0) return new DecisonTree();
  let currentScore = scoref(rows);

  //Set up some variable to track the best criteria
  let bestGain = 0.0;
  let bestCriteria;
  let bestSets;

  let columnCount = rows[0].length - 1;
  for (var col = 0; col < columnCount; col++) {
    //Generate the list of different values in the column
    let columnValues = {};
    for (row of rows) {
      columnValues[row[col]] = 1;
    }

    for (let value of Object.keys(columnValues)) {
      let [set1,set2] = devideSet(rows, col, value);

      //Information gain
      let p = set1.length / rows.length;
      let gain = currentScore - p * scoref(set1) - (1 - p) * scoref(set2);
      if (gain > bestGain && set1.length > 0 && set2.length > 0) {
        bestGain = gain;
        bestCriteria = [col, value];
        bestSets = [set1, set2];
      }
    }

  }

  if (bestGain > 0) {
    let trueBranch = buildTree(bestSets[0], scoref);
    let falseBranch = buildTree(bestSets[1], scoref);
    return new DecisonTree({
      col: bestCriteria[0],
      value: bestCriteria[1],
      tb: trueBranch,
      fb: falseBranch,
    });
  }else {
    return new DecisonTree({results:uniquecounts(rows)});
  }
}

function classify(observation, tree) {
  if (tree.results !== null) {
    return tree.results;
  } else {
    let v = observation[tree.col];
    let branch = null;
    if (!isNaN(parseFloat(tree.value))) {
      branch = (v >= tree.value) ? tree.tb : tree.fb;
    } else {
      branch = (v === tree.value) ? tree.tb : tree.fb;
    }

    return classify(observation, branch);
  }
}

function prune(tree, mingain) {
  //If the branches aren't leaves, then prune them
  if (tree.tb.results === null) {
    prune(tree.tb, mingain);
  }

  if (tree.fb.results === null) {
    prune(tree.fb, mingain);
  }

  //If both the subbranche are now leaves, see if they
  //should merged
  if (tree.tb.results !== null && tree.fb.results !== null) {
    let tb = [];
    let fb = [];
    for (let c in tree.tb.results) {
      tb = [].concat(tb, new Array(tree.tb.results[c]).fill([c]));
    }

    for (let c in tree.fb.results) {
      fb = [].concat(fb, new Array(tree.fb.results[c]).fill([c]));
    }

    let all = [].concat(tb, fb);
    let delta = entropy(all) - (entropy(tb) + entropy(fb) / 2);

    // console.log(delta, mingain)
    if (delta < mingain) {
      tree.tb = null;
      tree.fb = null;
      tree.results = uniquecounts(all);
    }
  }
}

function mdclassify(observation, tree) {
  if (tree.results !== null) {
    return tree.results;
  } else {
    let v = observation[tree.col];
    if (v === null) {
      let tr = mdclassify(observation, tree.tb);
      let fr = mdclassify(observation, tree.fb);
      let tcount = sum(tr);
      let fcount = sum(fr);
      let tw = (tcount) / (tcount + fcount);
      let fw = (fcount) / (tcount + fcount);
      let results = {};

      for (let k in tr) {
        results[k] = tr[k] * tw;
      }

      for (let k in fr) {
        results[k] = fr[k] * fw;
      }

      return results;

    } else {
      if (!isNaN(parseFloat(v))) {
        branch = (v >= tree.value) ? tree.tb : tree.fb;
      } else {
        branch = (v == tree.value) ? tree.tb : tree.fb;
      }

      return mdclassify(observation, branch);
    }
  }

}

function printTree(tree, indent) {
  var indent = indent || '';
  if (tree.results !== null) {
    console.log(indent + JSON.stringify(tree.results));
  } else {
    console.log(`${tree.col} : ${tree.value} ?`);

    console.log(indent + 'T->');
    printTree(tree.tb, indent + '  ');
    console.log(indent + 'F->');
    printTree(tree.fb, indent + '  ');
  }
}

function variance(rows) {
  if (rows.length === 0) return 0;
  let data = [];
  for (let row in rows) {
    data.push(rows[rows[row].length - 1]);
  }

  let mean = sum(data) / data.length;
  let dd = [];
  for (var d in data) {
    dd.push(Math.pow((data[d] / mean), 2));
  }

  return sum(dd) / data.length;
}
