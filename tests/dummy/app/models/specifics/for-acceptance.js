import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForAcceptance extends Model {
  @attr('boolean') agree;

  validations = {
    agree: {
      acceptance: true,
    },
  };
}

export default ForAcceptance;
