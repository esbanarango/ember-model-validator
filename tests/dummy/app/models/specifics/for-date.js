import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
  birthdate: attr('date'),
  graduationDate: attr('date'),

  init() {
    this._super(...arguments);
    this.validations = {
      birthdate: {
        date: {
          before: new Date()
        }
      },
      graduationDate: {
        date: {
          after: '2015-01-01'
        }
      }
    };
  }
});
