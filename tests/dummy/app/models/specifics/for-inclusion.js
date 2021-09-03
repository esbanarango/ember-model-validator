import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForInclusion extends Model {
  @attr('string') playerName;

  validations = {
    playerName: {
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'] },
    },
  };
}

export default ForInclusion;
