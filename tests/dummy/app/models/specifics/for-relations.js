import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForRelations extends Model {
  @belongsTo('specifics.for-presence') relationYeah;
  @attr('boolean') happyWithMyRelation;

  validations = {
    happyWithMyRelation: {
      acceptance: true,
    },
    relationYeah: {
      relations: ['belongsTo'],
    },
  };
}

export default ForRelations;
