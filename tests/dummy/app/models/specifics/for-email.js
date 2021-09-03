import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForEmail extends Model {
  @attr('string') emailAddress;

  validations = {
    emailAddress: {
      email: true,
    },
  };
}

export default ForEmail;
