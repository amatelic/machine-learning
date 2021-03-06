class DecisonTreeGraph {
  constructor(el, tree) {
    this.canvas = document.querySelector(el);
    this.ctx = this.canvas.getContext('2d');
    this.tree = tree;
    this.d = this.countDepth(this.tree);
    this.padding = this.d * 150;
    this.setDimensions(this.d + 5);
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
  }

  setDimensions(depth) {
    this.width = depth * 150 - 100;
    this.height = depth * 150 - 100;
    this.canvas.setAttribute('width', `${depth * 400 - 100}px`);
    this.canvas.setAttribute('height', `${depth * 400 - 100}px`);
  }

  countDepth(tree) {
    if (tree === null) {
      return 1;
    }

    var a = 1 + this.countDepth(tree.tb);
    var b = 1 + this.countDepth(tree.fb);
    return (a > b) ? a : b;
  }

  arc(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#000';
    this.ctx.fill();
    this.ctx.stroke();
  }

  line(x, y, xd, yd) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(xd, yd);
    this.ctx.stroke();
  }

  setConditions(tree) {
    var text = (!isNaN(parseFloat(tree.value))) ? '? > ' + tree.value : '?==' + tree.value;
    return text;
  }

  show() {
    this.drawTree(this.tree, this.width / 2, 40, this.width / 2, 1);
  }

  getWidth(width) {
    return this.padding + width;
  }

  getImage() {
    var image = new Image();
    image.src = this.canvas.toDataURL('image/png');
    return image;
  }

  drawTree(tree, width, height, oldWidth, ct) {
    if (tree === null) {
      return 0;
    }

    if (tree.value) {
      this.ctx.fillText(this.setConditions(tree), this.getWidth(width - 10), height - 20);
      this.ctx.fillText('T', this.getWidth(width + 30), height);
      this.ctx.fillText('F', this.getWidth(width - 30), height);
    }

    if (tree.results) {
      this.ctx.fillText(JSON.stringify(tree.results), this.getWidth(width - 20), height + 20);
    }

    var sdvH = this.height / this.d;
    this.line(this.getWidth(width), height, this.getWidth(oldWidth), height - sdvH);
    this.arc(this.padding + width, height);
    this.drawTree(tree.tb, width + this.width / Math.pow(2, ct), height + sdvH, width, ct + 1);
    this.drawTree(tree.fb, width - this.width / Math.pow(2, ct), height + sdvH, width, ct + 1);
  }
}
