import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForHexcolor extends Model {
  @attr('string') favoriteColor;

  validations = {
    favoriteColor: {
      color: true,
    },
  };
}

export default ForHexcolor;
