import Component from '@ember/component';

export default Component.extend({
  tagName: 'form',
  classNames: 'ui form equal width',
  attributeBindings: ['onsubmit'],

  submit(e) {
    e.preventDefault();
  },

  onsubmit(e) {
    e.preventDefault();
  }
});
