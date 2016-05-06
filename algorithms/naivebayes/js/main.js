var region = new LayoutView({
  regions: {
    header: 'header',
    mails: 'main',
    navigation: 'aside',
  },
});

function mailAdapter(res) {
  this.data = Object.keys(res).reduce((object, n) => {
    object[n] = new Mails(res[n]);
    return object;
  }, {});
  this.navigate('mails', {trigger: true});
}

var Route = Backbone.Router.extend({
  initialize(opt) {
    Object.assign(this, opt);
    var data = 'http://localhost:3000/mails';
    this.region.onShow('header', new SearcheView());
    this.region.onShow('navigation', new NavigationView());
    this.region.onShow('mails', new MailsView({collection: new Mails()}));
    this.navigate('/mails', {trigger: true});
    var newMail =  new newMailView({el: '.new__mail', model: new newEmail()});
    Backbone.Events.on('create:mail', (d) => {
      console.log(newMail.toggle());
    });
  },

  routes: {
    mails: 'mails',
  },

  mails() {
    $.get('http://localhost:3000/mails', (res) => {
      var mailsView = this.region.getRegion('mails');
      var obj = Object.keys(res).reduce((p, n) => p.concat(res[n]), []);
      mailsView.collection.add(obj, {parse: true});
    });

  },
});


Backbone.history.start();
var route = new Route({region});
