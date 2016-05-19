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

var route = new Route({region});

var app = new AppView({region, route});

route.on('route', function(route, params) {
  if (null === params[0]) {
    app.home();
  }
});

Backbone.history.start();
