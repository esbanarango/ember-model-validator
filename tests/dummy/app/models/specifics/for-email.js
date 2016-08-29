import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  emailAddress: DS.attr('string'),

  validations: {
    emailAddress: {
      email: true
    }
  }
});
