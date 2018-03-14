import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
  socialSecurity: attr('string'),
  nsaNumber: attr('string'),
  chuncaluchoNumber: attr('string'),
  hugeName: attr('string'),
  smallName: attr('string'),

  init() {
    this._super(...arguments);
    this.validations = {
      socialSecurity: {
        length: 5
      },
      nsaNumber: {
        length: [3, 5]
      },
      chuncaluchoNumber: {
        length: { is: 10, message: 'this is not the length of a chuncalucho' }
      },
      hugeName: {
        length: {
          minimum: 3,
          maximum: 5
        }
      },
      smallName: {
        length: {
          minimum: 1,
          maximum: {
            value: 2,
            message: 'should be smaller'
          }
        }
      }
    };
  }
});
