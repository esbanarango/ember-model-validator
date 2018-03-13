import Component from '@ember/component';

export default Component.extend({
  type: "handlebars",

  classNames: ['annotation', 'transition'],
  classNameBindings: ['showing:visible:hidden']
});