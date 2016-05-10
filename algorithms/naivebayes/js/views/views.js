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
  initialize(opt) {
    this.appEvent = opt.appEvent;
    this.listenTo(this.collection, 'add', this.addEmail.bind(this));
  },

  events: {
    'click .mails__mail': 'showMail',
  },
  display() {
    this.collection.each(this.addEmail, this);
  },

  addEmail(model) {
    this.$el.find('.mails__all').prepend(`
        <div data-id="${model.get('id')}" class="mails__mail">
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

  showMail(e) {
    var el = $(e.target);
    let id = (el.hasClass('mails__mail')) ? el.data('id') : el.closest('.mails__mail').data('id');
    this.appEvent.trigger(`show:mail`, {id: id});
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

  events: {
    'click span.new__mail__close': 'toggle',
    'click .mail__button': 'submit',
  },

  submit(e) {
    Array.from(this.$el.find('input, textarea')).forEach(d => {
      if (d.value !== '') {
        this.model.set(d.dataset.validate, d.value);
      }
    });
    this.model.save();
  },

  toggle() {
    this.$el.toggleClass('new__mail--hidden');
  },

  template() {
    return `
      <div class="new__mail__header">
        <div class="new__mail__banner">New message:<span class="new__mail__close">X</span></div>
        <div class="mail__input"><span>For:</span><input data-validate="title" placeholder="email" type="type"></div>
        <div class="mail__input"><span>Purpos:</span><input data-validate="email" placeholder="title" type="type"></div>

      </div>
      <div class="new__mail__body">
        <textarea data-validate="content"  rows="8" cols="40" placeholder="Message"></textarea>
        <button class="mail__button" type="button" name="button">Send</button>
      </div>`;
  },
});

var MailShow = BasicView.extend({
  classNames: 'display__email',
  template() {
    return `
      <div class="display__email__header">
        <h2>${this.model.get('title')}</h2>
        <hr>
        <p>Tags: ${this.model.get('category').join(',')}</p>
      </div>
      <div class="display__email__body">
        <p>${this.model.get('content')}</p>
        <p>Writen: <time>${this.model.get('date').fromNow()}</time></p>
      </div>
    `;
  },
});
