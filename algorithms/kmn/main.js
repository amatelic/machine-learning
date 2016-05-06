var canvas = new Canvas('#canvas');
canvas.setScale(1700, 350, 10, 1);

$.when($.get('http://localhost:3000/data')).then(d => {
  var mean = new Kmeans(d, 3);
  canvas.scatter(d);
  var classifiers = mean.setClassify();
  canvas.reset();
  var clasfy = mean.classify();
  var colors = ['red', 'blue', 'green', 'pink'];
  classifiers.forEach((d, i) => {
    canvas.arc(d[1], d[0], colors[i], 10);
  });

  Object.keys(clasfy).forEach(category => {
    clasfy[category].forEach(point => {
      canvas.arc(point.area, point.rooms, colors[category]);
    });
  });
});
