import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from '../mixins/model-validator';

export default Model.extend(Validator, {
  name: attr('string'),
  email: attr('string'),

  init() {
    this._super(...arguments);
    this.validations = {
      name: {
        presence: true
      },
      email: {
        presence: true,
        email: true
      }
    };
  }
});
