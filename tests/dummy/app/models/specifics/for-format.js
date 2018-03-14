import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
  secretLettersCode: attr('string'),
  secretNumericCode: attr('string'),

  init() {
    this._super(...arguments);
    this.validations = {
      secretLettersCode: {
        format: { with: /^[a-zA-Z]+$/, message: 'Only letters pls' }
      },
      secretNumericCode: {
        format: { with: /^[0-9]+$/, message: 'Only numbers pls' }
      }
    };
  }
});
