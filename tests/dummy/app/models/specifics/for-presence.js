import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
  fullName: attr('string'),
  fruit: attr('string'),
  color: attr('string'),

  init() {
    this._super(...arguments);
    this.validations = {
      fullName: {
        presence: true
      },
      fruit: {
        presence: true
      }
    };
  }
});
