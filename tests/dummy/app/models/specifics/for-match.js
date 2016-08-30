import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  email: DS.attr('boolean'),
  confirmationEmail: DS.attr('boolean'),
  password: DS.attr('boolean'),
  passwordConfirmation: DS.attr('boolean'),

  validations: {
    email:{
      match: 'confirmationEmail',
      presence: true
    },
    password:{
      match: {
        attr: 'passwordConfirmation',
        message: 'sup, it is not the same!'
      },
      presence: true
    }
  }
});
