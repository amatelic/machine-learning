class Node {
  constructor(obj) {
    Object.assign(this, obj);
  }

  addNeigbors(collection) {
    this.neigbors = collection.slice(0);
  }

  removeNeigbors() {
    this.neigbors = null;
  }

  setType(type) {
    this.type = type;
  }

}

class NodeList {
  constructor(collection, Node, k = 3, type = 'type') {
    this.node = Node;
    this.type = type;
    this.k = k;
    this.collection = collection.map(n => new Node(n)) || [];
    this.keys = Object.keys(collection[0]).filter(d => d !== type);
    for (let key of this.keys) {
      if (!this.params) this.params = {};
      this.params[key] = {
        min: 9999999,
        max: 0,
      };
    }

    this.getMinMaxValue();

  }

  getMinMaxValue() {
    this.keys.forEach(keys => {
      this.params[keys].max = this.collection.reduce((p,v) => (p > v[keys]) ? p : v[keys], 0);
      this.params[keys].min = this.collection.reduce((p,v) => (p < v[keys]) ? p : v[keys], 9999999);
    });
  }

  addNode(x, y) {
    var node = new this.node({rooms: y, area: x, type: null});
    let type = this.findType(node);
    node.setType(type);
    this.collection.push(node);
    return node;
  }

  findType(node) {
    node.addNeigbors(this.collection);
    var data = this.euclidianDestination(node, this.params);
    var sorted = data.sort((a,b) => b.cor - a.cor).slice(0, this.k);
    node.removeNeigbors();
    return this.selectType(sorted);
  }

  normalize(value, max, min) {
    return (value - min) / (min - max);
  }
  /**
   * @param Node       the node to check
   * @param Object     all parameters for calculating the distance
   * @return Object    {corelation, type}
   * @resources https://en.wikipedia.org/wiki/Euclidean_distance
   */
  euclidianDestination(node, params) {
    let {sqrt, pow} = Math;
    return node.neigbors.map(neigbor => {
      let data = [];
      for (let key of Object.keys(params)) {
        data.push(this.normalize(node[key], params[key].max, params[key].min) - this.normalize(neigbor[key], params[key].max, params[key].min));
      }

      //Eucledian distance formula 1 / sqrt((a)^2 + b^2 ... +  n^2)
      data = data.map(d => pow(d, 2))
                .reduce((a,b) => a + b, 0);
      return {
        cor: 1 / sqrt(data),
        type: neigbor.type,
      };
    });
  }

  selectType(collection) {
    let correct = null;
    let count = 0;
    let types = collection.reduce((obj, n) => {
      if (!obj[n.type]) obj[n.type] = 0;
      obj[n.type] += 1;
      return obj;
    }, {});
    for (var type in types) {
      if (types[type] > count) {
        count = types[type];
        correct = type;
      }
    }

    return correct;
  }
}
