import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForAbsence extends Model {
  @attr('string') autoGenerate;

  validations = {
    autoGenerate: {
      absence: true,
    },
  };
}

export default ForAbsence;
