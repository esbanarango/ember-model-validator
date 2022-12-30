import EmberObject, { get } from '@ember/object';

export default EmberObject.extend({
  _regex: /\{(\w+)\}/g,

  formatMessage(message, context = {}) {
    return message.replace(get(this, '_regex'), (_s, attr) => context[attr]);
  },
});
