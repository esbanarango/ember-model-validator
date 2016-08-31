import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  birthdate: DS.attr('date'),
  graduationDate: DS.attr('date'),

  validations: {
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
  }
});
