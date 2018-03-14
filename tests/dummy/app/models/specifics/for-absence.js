import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
  autoGenerate: attr('string'),

  init() {
    this._super(...arguments);
    this.validations = {
      autoGenerate: {
        absence: true
      }
    };
  }
});
