var LayoutView = Backbone.View.extend({
  el: 'body',
  regions: {},
  transitionLayout: [],
  initialize(options) {
    _.extend(this, options);
    this.setRegions();
  },

  setRegions() {
    for (var region in this.regions) {
      if (this.regions.hasOwnProperty(region)) {
        this.regions[region] = {
          $el: this.$el.find(this.regions[region]),
          prevView: null,
        };
      }
    }
  },

  getRegion(name) {
    if (_.isUndefined(this.regions[name])) throw new Error(`Region dosen't extsist`);

    return this.regions[name].prevView;
  },
  //add depenednies to childrens
  addChildrenDependencys(view) {
    view.addDependency({parent: this.childeEvents});
  },

  onShow(regionName, view, options) {

    if (this.regions[regionName].prevView) {
      this.regions[regionName].prevView.onClose();
    }

    this.regions[regionName].prevView = view;
    view.beforeRender();
    this.regions[regionName].$el.html(view.render().el); ///replacing whole view
    this.addChildrenDependencys(view);
    view.afterRender();
  },

});

var BasicView = Backbone.View.extend({

  //add paresnt dependencys to view
  addDependency(dependency) {
    for (var dep in dependency) {
      if (dependency.hasOwnProperty(dep)) {
        this[dep] = dependency[dep];
      }
    }
  },

  render() {
    this.$el.html(this.template());
    return this;
  },

  template() { return ``;},

  beforeRender() {},

  afterRender() {},

  onClose() {
    this.unbind();
    this.remove();
  },
});
