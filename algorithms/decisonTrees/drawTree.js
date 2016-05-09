class DecisonTreeGraph {
  constructor(el, tree) {
    this.canvas = document.querySelector(el);
    this.padding = 50;
    this.ctx = this.canvas.getContext('2d');
    this.height = this.canvas.clientHeight - 100;
    this.width = this.canvas.clientWidth - 100;
    this.ctx.clearRect(0, 0, this.canvas.clientHeight, this.canvas.clientWidth);
    this.tree = tree;
    this.d = this.countDepth(this.tree);
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
    var text = (!isNaN(parseFloat(tree.value))) ? 'value > ' + tree.value : 'value==' + tree.value;
    return text;
  }

  show() {
    this.drawTree(this.tree, this.width / 2, this.height / this.d, this.width / 2);
  }

  getWidth(width) {
    return this.padding + width;
  }

  drawTree(tree, width, height, oldWidth) {
    var hp = 1.3;
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

    this.line(this.getWidth(width), height, this.getWidth(oldWidth), height / hp);
    this.arc(this.padding + width, height);

    if (width > (this.width / 2)) {
      this.drawTree(tree.tb, width + (width / 6), height * hp, width);
      this.drawTree(tree.fb, width - (width / 6), height * hp, width);
    } else {
      this.drawTree(tree.tb, width + (width / 2), height * hp, width);
      this.drawTree(tree.fb, width - (width / 2), height * hp, width);
    }
  }
}
