var Mail = Backbone.Model.extend({
  parse(data) {
    data.date = moment(data.date, 'MM DD YYY');
    return data;
  },

});

var newEmail = Backbone.Model.extend({
  urlRoot() {
    return 'http://localhost:5000/new_mail';
  },
});
var Mails = Backbone.Collection.extend({
  url: 'http://localhost:5000/new',
  model: Mail,
  initialize() {
    setInterval(() => this.fetch(), 5000);
  }
});
