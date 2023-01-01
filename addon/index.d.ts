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
   */
  export default function modelValidator<T>(target: T): T & { validate: (options?: validateOptions) => boolean };

  export interface validateOptions {
    except: string[];
    only: string[];
    addErrors: boolean;
  }
}
