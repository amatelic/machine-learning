var evn = _.extend({}, Backbone.Events);

var houses = new Collections();

var colors = {
  house: 'blue',
  flat: 'red',
  apartment: 'green',
};

$.when(houses.fetch()).then((d) => {
  var lists = new NodeList(d, Node, 10);
  var tb = new Tables({model: houses, canvas: evn});
  var col = new CanvasCollection(d);

  var canvas = new Canvas('#canvas', {
    data: d,
    type: 'scatter',
  });

  setInterval(() => {
    var y = Math.round(Math.random() * 9 + 1);
    var x = Math.round(Math.random() * 1650 + 50);
    tb.addDummy(x, y)
  }, 1000);

  canvas.createXLabel();
  canvas.createYLabel();
  canvas.draw(colors);
  evn.on('addDot', (x, y) => {
    var node = lists.addNode(x,y);
    var y = 300 - canvas.normalize(y, 10, 0, canvas.height - canvas.padding);
    var x = canvas.normalize(x, 1700, 0, canvas.width - canvas.padding);
    canvas.arc(x, y, 5, colors[node.type]);
  });
});
