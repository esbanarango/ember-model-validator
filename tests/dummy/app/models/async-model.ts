import Model from '@ember-data/model';

export default class AsyncModel extends Model {}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'async-model': AsyncModel;
  }
}
