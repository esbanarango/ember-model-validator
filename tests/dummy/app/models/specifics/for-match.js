import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForMatch extends Model {
  @attr('boolean') email;
  @attr('boolean') confirmationEmail;
  @attr('boolean') password;
  @attr('boolean') passwordConfirmation;

  validations = {
    email: {
      match: 'confirmationEmail',
      presence: true,
    },
    password: {
      match: {
        attr: 'passwordConfirmation',
        message: 'sup, it is not the same!',
      },
      presence: true,
    },
  };
}

export default ForMatch;
