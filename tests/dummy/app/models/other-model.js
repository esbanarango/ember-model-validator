import DS from 'ember-data';
import Validator from '../mixins/validator';

export default DS.Model.extend(Validator,{
  name: DS.attr('string'),
  email: DS.attr('string'),

  validations: {
    presence: ['name','email'],
    email: ['email']
  }

});
