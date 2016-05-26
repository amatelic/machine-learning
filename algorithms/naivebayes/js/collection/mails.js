var Mail = Backbone.Model.extend({
  urlRoot: 'http://localhost:5000/new_mail',
  defaults: {
    title: '',
    category: [],
    content: '',
    date: new Date(),
  },

  validate(attr, opt) {
    console.log(attr, opt);
  },

  parse(data) {
    data.date = moment(data.date);
    return data;
  },

});

// //Class
// var newEmail = Backbone.Model.extend({
// });

var Mails = Backbone.Collection.extend({
  model: Mail,
  page: 0,
  urlString: 'mails',
  url() { return `http://localhost:5000/${this.urlString}`; },

  initialize(path) {
    setInterval(() => this.fetchData('new', {remove: false}), 5000);
  },

  filterBy(query) {

    if (_.isEmpty(query)) {
      this.trigger('filterby', this.models);
      return;
    }

    let filterData = this.filter((model) => {
      return model.get('category').indexOf(query.substr(1)) !== -1;
    });
    this.trigger('filterby', filterData);
  },

  parse(res) {
    this.page = res.page;
    return res.mails;
  },

  fetchData(url, opt = null) {
    this.urlString = (url) ? url : this.urlString;
    return this.fetch(opt);
  },
});
