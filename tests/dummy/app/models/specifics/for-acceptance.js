import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
  agree: attr('boolean'),

  init() {
    this._super(...arguments);
    this.validations = {
      agree: {
        acceptance: true
      }
    };
  }
});
