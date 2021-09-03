import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForPresence extends Model {
  @attr('string') fullName;
  @attr('string') fruit;
  @attr('string') color;

  validations = {
    fullName: {
      presence: true,
    },
    fruit: {
      presence: true,
    },
  };
}

export default ForPresence;
