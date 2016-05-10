var Route = Backbone.Router.extend({
  routes: {
    '*path': 'show',
  },
  show(id) {},
});

class AppView {
  constructor(opt) {
    Object.assign(this, opt);
    this.mails = new Mails();
    this.mails.fetch();
    this.index();
    this.events();
  }

  index() {
    this.region.onShow('header', new SearcheView());
    this.region.onShow('navigation', new NavigationView());
    this.newMail =  new newMailView({el: '.new__mail', model: new newEmail()});
    this.home();
  }

  home() {
    this.region.onShow('mails', new MailsView({
      appEvent: Backbone.Events,
      collection: this.mails,
    }));
    this.region.getRegion('mails').display();
  }

  events() {
    Backbone.Events.on('create:mail', (d) => this.newMail.toggle());
    Backbone.Events.on('show:mail', (id) => {
      let model = this.mails.get(id);
      this.route.navigate('mails', {trigger: true});
      this.region.onShow('mails', new MailShow({model}));
    });
    Backbone.Events.on('show:index', 1);
  }
}
