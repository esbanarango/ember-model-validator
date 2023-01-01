import EmberObject from '@ember/object';

export default class MessageFormater extends EmberObject {
  _regex = /\{(\w+)\}/g;
  formatMessage(message, context = {}) {
    return message.replace(this._regex, (_s, attr) => context[attr]);
  }
}
