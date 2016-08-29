import Ember from 'ember';

const {
  get
} = Ember;

export default Ember.Object.extend({
  _regex: /\{(\w+)\}/g,

  formatMessage(message, context = {}) {
    return message.replace(get(this, '_regex'), (s, attr) => context[attr]);
  }
});