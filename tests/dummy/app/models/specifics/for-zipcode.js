import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  postalCode: DS.attr('string'),

  validations: {
    postalCode:{
      zipCode: true
    }
  }
});
