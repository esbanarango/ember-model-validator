import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
  email: attr('boolean'),
  confirmationEmail: attr('boolean'),
  password: attr('boolean'),
  passwordConfirmation: attr('boolean'),

  init() {
    this._super(...arguments);
    this.validations = {
      email: {
        match: 'confirmationEmail',
        presence: true
      },
      password: {
        match: {
          attr: 'passwordConfirmation',
          message: 'sup, it is not the same!'
        },
        presence: true
      }
    };
  }
});
