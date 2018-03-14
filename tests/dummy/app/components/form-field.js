import { A } from '@ember/array';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: 'ui field',
  classNameBindings: ['hasError:error', 'fieldClass', 'for', 'required'],

  object: alias('parentView.for'),

  fieldClass: computed('group', {
    get() {
      var isGroup = this.get('group'),
        fieldClass = isGroup ? 'fields' : 'field';

      return fieldClass;
    }
  }),

  hasError: computed('object.errors.[]', {
    get() {
      var _ref = this.get('object.errors');

      return _ref != null ? _ref.has(this.get('for')) : void 0;
    }
  }),

  errors: computed('object.errors.[]', {
    get() {
      if (!this.get('object.errors')) {
        return A();
      }
      return this.get('object.errors')
        .errorsFor(this.get('for'))
        .mapBy('message')[0];
    }
  })
});
