import Model from '@ember-data/model';
import { belongsTo } from '@ember-data/model';
import type FakeModel from './fake-model';

export default class AsyncModel extends Model {
  @belongsTo('fake-model', { async: false, inverse: 'asyncModel' }) declare fakeModel: FakeModel;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'async-model': AsyncModel;
  }
}
