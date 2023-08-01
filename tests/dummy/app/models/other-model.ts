import Model, { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import { modelValidator, type ValidationsConfig, type ValidatedModel } from 'ember-model-validator';

interface OtherModel extends ValidatedModel, Model {}

@modelValidator
class OtherModel extends Model {
  @belongsTo('fake-model', { async: true, inverse: 'otherFakes' }) declare fakeModel: AsyncBelongsTo<OtherModel>;

  @attr('string') declare name: string;

  validations: ValidationsConfig = {
    name: {
      presence: true,
    },
    email: {
      presence: true,
      email: true,
    },
  };
}

export default OtherModel;

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'other-model': OtherModel;
  }
}
