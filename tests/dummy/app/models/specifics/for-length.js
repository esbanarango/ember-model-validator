import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  socialSecurity: DS.attr('string'),
  nsaNumber: DS.attr('string'),
  chuncaluchoNumber: DS.attr('string'),
  hugeName: DS.attr('string'),
  smallName: DS.attr('string'),

  validations: {
    socialSecurity: {
      length: 5
    },
    nsaNumber: {
      length: [3, 5]
    },
    chuncaluchoNumber: {
      length: { is: 10, message: 'this is not the length of a chuncalucho' }
    },
    hugeName:{
      length: {
        minimum: 3,
        maximum: 5
      }
    },
    smallName:{
      length: {
        minimum: 1,
        maximum: {
          value: 2,
          message: 'should be smaller'
        }
      }
    }
  }
});