/* global Prism*/
import Component from '@ember/component';

import { computed, observer } from '@ember/object';
import { equal } from '@ember/object/computed';
import { run } from '@ember/runloop';

export default Component.extend({
  valid: equal('errors.length', 0),

  init: function() {
    this._super();
    run.scheduleOnce('afterRender', this, this._highlight);
  },

  validText: computed('valid', function() {
    return this.valid ? 'No Errors' : 'With Errors';
  }),

  /* eslint-disable ember/no-observers */
  errorsAdded: observer('errors.length', function() {
    run.next(this, this._highlight);
  }),

  _highlight() {
    this.$('code').html(
      this.$('.for-code')
        .html()
        .trim()
    );
    Prism.highlightElement(this.$('code')[0]);
  }
});
