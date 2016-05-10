var Mail = Backbone.Model.extend({
  parse(data) {
    data.date = moment(data.date);
    return data;
  },

});

var newEmail = Backbone.Model.extend({
  urlRoot: 'http://localhost:5000/new_mail',
});
var Mails = Backbone.Collection.extend({
  model: Mail,
  page: 0,
  urlString: 'mails',
  url() { return `http://localhost:5000/${this.urlString}`; },

  initialize(path) {
    setInterval(() => this.fetchData('new', {remove: false}), 5000);
  },

  parse(res) {
    this.page = res.page;
    console.log(res)
    return res.mails;
  },

  fetchData(url, opt = null) {
    this.urlString = (url) ? url : this.urlString;
    console.log(this)
    return this.fetch(opt);
  },
});
