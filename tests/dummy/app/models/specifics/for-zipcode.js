import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForZipcode extends Model {
  @attr('string') postalCode;

  validations = {
    postalCode: {
      zipCode: true,
    },
  };
}

export default ForZipcode;
