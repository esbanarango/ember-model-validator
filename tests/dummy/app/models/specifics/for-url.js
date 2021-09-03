import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForUrl extends Model {
  @attr('string') blogUrl;

  validations = {
    blogUrl: {
      URL: true,
    },
  };
}

export default ForUrl;
