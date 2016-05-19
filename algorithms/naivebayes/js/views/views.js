var SearcheView = BasicView.extend({
  className: 'header',
  events: {
    'keyup input': 'getData',
  },
  initialize() {
    this.makeSearche = _.debounce(this.makeSearche, 500);
  },

  getData(e) {
    this.makeSearche(e);
  },

  makeSearche(e) {
    let params = e.target.value;
    $.get('http://localhost:5000/searche', {q: params}).then(res => {
      this.$el.find('.query__response').removeClass('hidden');
      this.$el.find('.query__response > ul').empty();
      res.results.forEach(this.showSearcheResponse.bind(this));
    });
    $('body').one('click', () => this.$el.find('.query__response').addClass('hidden'));
  },

  showSearcheResponse(d) {
    this.$el.find('.query__response > ul').append(`<li>${d}</li>`);
  },

  template() {
    return `
      <div class="header__logo">
        Google
      </div>
      <div class="header__searche">
          <input type="text" name="name" value="">
          <button type="button" name="button">s</button>
          <div class="query__response hidden">
            <ul></ul>
          </div>
      </div>
      <div class="header__user">
        <img src="http://rampages.us/alharthiaa/wp-content/uploads/sites/8487/2015/08/5249700000_5247598126_mrbean_rare_collection_xlarge_xlarge.jpeg" alt="" />
      </div>`;
  },
});

var NavigationView = BasicView.extend({
  className: 'navigation',
  events: {
    'click button': (e) => Backbone.Events.trigger('create:mail'),
    'click a': 'spam',
  },
  spam(e) {
    e.preventDefault();
    Backbone.Events.trigger('show:spam', e.target.hash);
  },

  template() {
    return `
      <button class="navigation__button" type="button" name="button">New</button>
      <ul class="navigation__list">
        <li><a href="#">All</a></li>
        <li><a href="#new">New</a></li>
        <li><a href="#spam">Spam</a></li>
      </ul>`;
  },
});

var MailsView = BasicView.extend({
  className: 'mails',
  initialize(opt) {
    this.appEvent = opt.appEvent;
    this.listenTo(this.collection, 'add', this.addEmail.bind(this));
    this.listenTo(this.collection, 'filterby', function(collection) {
      this.$el.find('.mails__all').empty();
      collection.forEach(this.addEmail, this);
    }.bind(this));
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
      <p>Tags</p>
      <p>Content</p>
      <p>Date</p>
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
        <p>Tags: <span class="label label--default">${this.model.get('category').join('</span><span class="label label--default">')}</span></p>
      </div>
      <div class="display__email__body">
        <p>${this.model.get('content')}</p>
        <blockquote class="display__email__time">
          <time>Was received: ${ this.model.get('date').fromNow() }</time>
        </blockquote>
      </div>
    `;
  },
});
