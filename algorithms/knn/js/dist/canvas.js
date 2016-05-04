class Canvas {
  constructor(el, options) {
    this.el = document.querySelector(el);
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;
    this.padding = 15;
    this.ctx = this.el.getContext('2d');
    this.config =  Object.assign({}, options);
    this.ctx.fillStyle = "black";
    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
  }

  createXLabel() {
    var dimension = Math.round(Math.log10(this.config.data.length) / Math.log10(2));
    var max =  _.max(this.config.data, d => d.area)['area'];
    var maxWidth = this.normalize(max, max, 0, this.width - this.padding);
    this.ctx.moveTo(0 + this.padding, this.height - this.padding);
    this.ctx.lineTo(maxWidth, this.height - this.padding);
    var count = 0;
    var def = max / dimension;
    for (var i = 0; i <= dimension; i++) {
      var xCor = this.normalize(count, max, 0, this.width);
      this.createText(xCor - 15, this.height, count);
      count += def;
    }

  }

  createYLabel() {
    var dimension = Math.round(Math.log10(this.config.data.length) / Math.log10(2));
    var max =  _.max(this.config.data, d => d.rooms)['rooms'];
    var maxHeight = this.normalize(max, max, 0, this.height - this.padding);
    this.ctx.moveTo(this.padding, this.padding);
    this.ctx.lineTo(this.padding, maxHeight);
    var count = 0;
    var def = max / dimension;
    for (var i = 0; i <= dimension; i++) {
      var yCor = this.normalize(count, max, 0, this.height - this.padding);
      this.createTextY(this.padding, this.height - yCor, count);
      count += def;
    }

  }

  normalize(value, max, min, domain) {
    return (value - min) / (max -  min) * domain;
  }

  createText(x, y, text) {
    text = (typeof text === 'number') ? Math.round(text) : text;
    x = Math.abs(x);
    this.ctx.moveTo(x, y - 25);
    this.ctx.lineTo(x, y - this.padding);
    this.ctx.fillText(text, x - 10, y);
  }

  createTextY(x, y, text) {
    text = (typeof text === 'number') ? Math.round(text) : text;
    x = Math.abs(x);
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + 15, y);
    this.ctx.fillText(text, x - 10, y);
  }

  draw(colors) {
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
    this.scatter(colors);
  }

  scatter(colors) {
    var maxY =  _.max(this.config.data, d => d.rooms)['rooms'];
    var maxX =  _.max(this.config.data, d => d.area)['area'];
    this.config.data.forEach((d) => {
      var y = this.height - this.normalize(d.rooms, maxY, 0, this.height - this.padding);
      var x = this.normalize(d.area, maxX, 0, this.width - this.padding);
      this.arc(x, y, 5, colors[d.type]);
    });

  }

  arc(x, y, size, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(x, y, size, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
  }
}

var CanvasModel = Backbone.Model.extend({
});

var CanvasCollection = Backbone.Collection.extend({
  model: CanvasModel,
});
