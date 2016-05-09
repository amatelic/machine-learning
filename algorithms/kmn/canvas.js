class Canvas {
  constructor(el) {
    this.canvas = document.querySelector(el);
    this.ctx = this.canvas.getContext('2d');
    this.height = this.canvas.clientHeight - 100;
    this.width = this.canvas.clientWidth - 100;
  }

  setScale(xMax, xMin, yMax, yMin) {
    this.xScale = this.normalize(xMax, xMin);
    this.yScale = this.normalize(yMax, yMin);
  }


  reset() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
  }

  arc(x, y, color = '#000', size = 5) {
    var x = this.xScale(x) * this.width + 50;
    var y = this.yScale(y) * this.height + 50;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.stroke();
  }

  normalize(max, min) {
    return (value) => (value - min) / (max - min);
  }

  scatter(collection) {
    collection.forEach(d => {
      this.arc(d.area, d.rooms);
    });
  }

}
