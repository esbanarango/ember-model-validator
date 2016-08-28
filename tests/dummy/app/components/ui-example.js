
import Ember from 'ember';

export default Ember.Component.extend({
  showing: true,

  actions: {
    toggle() {
      this.toggleProperty('showing');
    },
    setCopyCode(code) {
      this.$('[data-clipboard-text]').attr('data-clipboard-text', code);
    }
  }

});