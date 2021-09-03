import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForFormat extends Model {
  @attr('string') secretLettersCode;
  @attr('string') secretNumericCode;

  validations = {
    secretLettersCode: {
      format: { with: /^[a-zA-Z]+$/, message: 'Only letters pls' },
    },
    secretNumericCode: {
      format: { with: /^[0-9]+$/, message: 'Only numbers pls' },
    },
  };
}

export default ForFormat;
