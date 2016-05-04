var Collections = Backbone.Model.extend({
  urlRoot: 'http://localhost:3000/data',

  parse(response) {
    var col = response.reduce((obj, res) => {
      if (!obj[res.type]) obj[res.type] = [];
      obj[res.type].push(res);
      return obj;
    }, {});
    return col;
  },
});

var Base = Backbone.View.extend({
  initialize() {
    this.before();
    this.render();
    this.after();
  },

  before() {},

  render() {},

  after() {},
});
