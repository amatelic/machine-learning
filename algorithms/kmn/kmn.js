class Kmeans {
  constructor(collection, k, type = 'type') {
    this.collection = collection;
    this.k = k;
    this.keys = Object.keys(collection[0]).filter(d => d !== type);
    for (let key of this.keys) {
      if (!this.params) this.params = {};
      this.params[key] = {
        min: 9999999,
        max: 0,
      };
    }

    this.getMinMaxValue();
    this.setScale(1700, 350, 10, 1);
  }

  getMinMaxValue() {
    this.keys.forEach(keys => {
      this.params[keys].max = this.collection.reduce((p,v) => (p > v[keys]) ? p : v[keys], 0);
      this.params[keys].min = this.collection.reduce((p,v) => (p < v[keys]) ? p : v[keys], 9999999);
    });
  }

  setClassify() {
    this.means = [];
    while (this.k--) {
      let mean = [];
      for (let d of this.keys) {
        let range = this.params[d].max - this.params[d].min;
        let m = this.params[d].min + (Math.random() * range);
        mean.push(m);
      }

      this.means.push(mean);
    }

    return this.means;
  }

  classify() {
    let {pow, sqrt} = Math;
    var mm = {};
    for (var data of this.collection) {
      let max = 0;
      let cluster = 0;
      this.means.forEach((d, i) => {
        var keys = Object.keys(data);
        let eq =  1 - sqrt(pow(this.yScale(d[0]) - this.yScale(data[keys[0]]), 2) + pow(this.xScale(d[1]) - this.xScale(data[keys[1]]), 2));
        if (eq > max) {
          max = eq;
          cluster = i;
        }
      });

      if (!mm[cluster]) {
        mm[cluster] = [];
      }

      mm[cluster].push(data);
    }

    return mm;
  }

  setScale(xMax, xMin, yMax, yMin) {
    this.xScale = this.normalize(xMax, xMin);
    this.yScale = this.normalize(yMax, yMin);
  }

  normalize(max, min) {
    return (value) => (value - min) / (max - min);
  }
}
