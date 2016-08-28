import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  fullName: DS.attr('string'),
  fruit: DS.attr('string'),
  color: DS.attr('string'),

  validations: {
    fullName:{
      presence: true
    },
    fruit:{
      presence: true
    }
  }

});
