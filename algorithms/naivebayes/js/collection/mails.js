var Mail = Backbone.Model.extend({
  parse(data) {
    data.date = moment(data.date, "MM DD YYYY");
    return data;
  },
});
var Mails = Backbone.Collection.extend({
  model: Mail,
});
var MailAdapter = Backbone.Model.extend({
  urlRoot: 'http://localhost:3000/mails',
  parse(res) {
    console.log(res);
  },
});
