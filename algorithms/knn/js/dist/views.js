var Table = Base.extend({
  tagName: 'table',
  className: 'table table-striped',
  initialize(params) {
    this.type = params.type;
    Base.prototype.initialize.call(this, arguments);
  },

  render() {
    this.$el.html(`
      <thead>
        <tr><td style="text-align: center;" colspan="2">${this.type}<td></tr>
        <tr>
          <td>Rooms</td><td>Areas</td>
        </tr>
      <thead>
      <tbody></tbody>`);
  },

  addOne(model) {
    this.body.append(`<tr><td>${model.rooms}</td><td>${model.area}</td></tr>`);
  },

  after() {
    this.body = this.$el.find('tbody');
  },
});

var Tables = Base.extend({
  el: '.table-data',
  children: {},
  events: {
    'keyup #rooms': 'addHouse',
    'keyup #area': 'addHouse',
  },
  initialize(prop) {
    this.canvasEvent = prop.canvas;
    Base.prototype.initialize.call(this, arguments);
  },

  addDummy(x, y) {
    this.canvasEvent.trigger('addDot', x, y);
  },

  addHouse(e) {
    var rooms = this.$el.find('#rooms').val();
    var area = this.$el.find('#area').val();
    // check if it is a number
    if (!_.isEmpty(rooms) && !_.isEmpty(area) && e.which === 13) {
      this.canvasEvent.trigger('addDot', area, rooms);
    }
  },

  addByType(type) {
    var collection = this.model.toJSON()[type];
    collection.forEach((d) => {
      this.children[type].view.addOne(d);
    });
  },

  render() {
    this.$el.html(`
      <div class="page-header">
        <h1>KNN algorithem:</h1>
      </div>
      <div class="form-groupc col-md-3">
        <label for="exampleInputPassword1">Add new value</label>
        <input type="text" value=10 class="form-control" id="rooms" placeholder="Rooms">
        </br>
        <input type="text" value=1500 class="form-control" id="area" placeholder="Area">
      </div>
      <div class="apartment col-md-3"></div>
      <div class="flat col-md-3"></div>
      <div class="house col-md-3"></div>`);
  },

  after() {
    Object.keys(this.model.toJSON()).forEach((type) => {
      this.children[type] = {};
      this.children[type].el = this.$el.find(`.${type}`);
      this.children[type].view = new Table({type});
      this.children[type].el.html(this.children[type].view.el);
      this.addByType(type);
    });
  },
});
