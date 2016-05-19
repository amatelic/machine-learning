var Table = Backbone.View.extend({
  tagName: 'table',
  className: 'table table-striped table-bordered',
  events: {
    'click button': 'getInput',
  },
  initialize(params) {
    this.event = params.event;
    this.event.on('classsify:response', this.prediction.bind(this));
  },

  prediction(values) {
    var max = 0;
    var result;
    for (let type in values) {
      if (values[type] > max) {
        max = values[type];
        result = type;
      }
    }
    this.$el.find('td.new').html(result);
  },

  getInput() {
    let input = Array.from(this.$el.find('input'));
    if (input.every(d => d.value !== '')) {
      let inputs = input.map(el => el.value);
      this.event.trigger('classsify', inputs);
    }
  },
  render() {
    this.$el.html(`
      <thead>
        <tr><td style="text-align: center;" colspan="${this.model.length}">Decison tree-data</td></tr>
        <tr>${this.createInputFields(this.model)}</tr>
        <tr><td colspan="${this.model.length}"><button class="btn btn-primary">Classify</button></td></tr>
        <tr>
          ${this.createHeader(this.model)}
        </tr>
      <thead>
      <tbody>
        ${this.createTable(this.model)}
      </tbody>`);
    return this;
  },

  createInputFields(collection) {
    let str = '';
    for (var i = 0; i < collection[0].length - 1; i++) {
      str += `<td><input class="form-control table-input" type='text'></td>`;
    }

    str += `<td class="new"></td>`;
    return str;
  },

  createHeader(collection) {
    return collection[0].reduce((str, n) => str += '<td>' + n + '</td>', '');
  },

  createTable(col) {
    col = col.slice(1);
    var data = ('<tr><td>' + col.map((row) => row.join('</td><td>')).join('</tr><tr><td>') + '</td></tr>');
    return data;
  },

});
