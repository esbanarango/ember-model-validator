declare module 'ember-model-validator/decorators/model-validator' {
  /**
   * @decorator
   *
   * Marks a property as tracked.
   *
   * By including Ember-model-validator's decorator into your model, this will have a validate function available,
   * it is a synchronous function which returns either true or false.
   * You can also pass an option hash for excluding or forcing certain attributes to be validated, and to prevent
   * errors to be added.
   *
   * ```typescript
   * import Model, { attr } from '@ember-data/model';
   * import Validator from 'ember-model-validator/decorators/model-validator';
   *
   * @Validator
   * export default class MyModel extends Model {
   *   @attr('string') declare name: string;
   *   @attr('string') declare email: string;
   * }
   * ```
   */
  export default function modelValidator<T extends { new (...args: any[]): object }>(constructor: T): T;
}

declare module 'ember-model-validator/decorators/core-validator' {
  export default function coreValidator<T extends { new (...args: any[]): object }>(constructor: T): T;
}
