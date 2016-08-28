import Ember from 'ember';

export default Ember.Component.extend({
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
