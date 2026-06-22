export default class MessageFormater {
  _regex = /\{(\w+)\}/g;
  formatMessage(message, context = {}) {
    return message.replace(this._regex, (_s, attr) => context[attr]);
  }
}
