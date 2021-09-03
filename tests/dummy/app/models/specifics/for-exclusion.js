import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForExclusion extends Model {
  @attr('string') playerName;

  validations = {
    playerName: {
      exclusion: { in: ['Gionvany Hernandez', 'Wilder Medina'] },
    },
  };
}

export default ForExclusion;
