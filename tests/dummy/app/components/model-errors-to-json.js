/* global Prism*/
import Ember from 'ember';

const {
  observer,
  computed,
  computed: { equal },
  run
} = Ember;

export default Ember.Component.extend({
  valid: equal('errors.length', 0),

  init: function () {
    this._super();
    run.scheduleOnce('afterRender', this, this._highlight);
  },

  validText: computed('valid', function() {
    return (this.get('valid') ? 'No Errors' : 'With Errors');
  }),

  errorsAdded: observer('errors.length',function() {
    run.next(this, this._highlight);
  }),

  _highlight() {
    this.$('code').html(this.$('.for-code').html().trim());
    Prism.highlightElement(this.$('code')[0]);
  }
});
