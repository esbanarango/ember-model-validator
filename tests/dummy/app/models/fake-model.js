import DS from 'ember-data';
import Validator from '../mixins/validator';

export default DS.Model.extend(Validator,{
  name: DS.attr('string'),
  email: DS.attr('string'),

  otherFakes: DS.hasMany('other-model'),

  validations: {
    name:{
      presence: true
    },
    email:{
      presence: true,
      email: true
    },
    otherFakes:{
      relations: ['hasMany']
    }
  }

});
