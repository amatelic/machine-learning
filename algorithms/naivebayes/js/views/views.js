var SearcheView = BasicView.extend({
  className: 'header',
  template() {
    return `
      <div class="header__logo">
        Google
      </div>
      <div class="header__searche">
          <input type="text" name="name" value="">
          <button type="button" name="button">s</button>
      </div>
      <div class="header__user">
        <img src="http://rampages.us/alharthiaa/wp-content/uploads/sites/8487/2015/08/5249700000_5247598126_mrbean_rare_collection_xlarge_xlarge.jpeg" alt="" />
      </div>`;
  },
});

var NavigationView = BasicView.extend({
  className: 'navigation',
  events: {
    'click button': (e) => Backbone.Events.trigger('create:mail') ,
  },

  template() {
    return `
      <button class="navigation__button" type="button" name="button">New</button>
      <ul class="navigation__list">
        <li><a href="#">All</a></li>
        <li><a href="#">New</a></li>
        <li><a href="#">Spam</a></li>
        <li><a href="#">Settings</a></li>
      </ul>`;
  },
});

var MailsView = BasicView.extend({
  className: 'mails',
  initialize() {
    this.listenTo(this.collection, 'add', this.addEmail.bind(this));
  },

  addEmail(model) {
    this.$el.find('.mails__all').append(`
        <div class="mails__mail">
          <p>${model.get('title')}</p>
          <p>${this.addCategory(model.get('category'))}</p>
          <p>${model.get('content').substr(0, 20)}...</p>
          <p>${ model.get('date').fromNow() }</p>
        </div>
    `);
  },

  addCategory(categories) {
    return categories.reduce((str, next) => {
      str += `<span class="label label--${next}">${next}</span>`;
      return str;
    }, ``);
  },

  template() {
    return `
    <div class="mails__filter">
      <p>Title</p>
      <p>Title</p>
      <p>2 from 100</p>
    </div>
    <div class="mails__all">
    </div>`;
  },
});

var newMailView = BasicView.extend({
  initialize() {
    this.render();
  },

  toggle() {
    this.$el.toggleClass('new__mail--hidden');
  },

  template() {
    return `
      <div class="new__mail__header">
        <div class="new__mail__banner">New message:</div>
        <div class="mail__input"><span>For:</span><input placeholder="email" type="type"></div>
        <div class="mail__input"><span>Purpos:</span><input placeholder="title" type="type"></div>

      </div>
      <div class="new__mail__body">
        <textarea name="name" rows="8" cols="40" placeholder="Message"></textarea>
        <button class="mail__button" type="button" name="button">Send</button>
      </div>`;
  },
});
