type ValidationKeys =
  | 'presence'
  | 'acceptance'
  | 'absence'
  | 'format'
  | 'length'
  | 'email'
  | 'zipCode'
  | 'color'
  | 'subdomain'
  | 'URL'
  | 'inclusion'
  | 'exclusion'
  | 'match'
  | 'date'
  | 'custom'
  | 'numericality'
  | 'mustContainCapital'
  | 'mustContainLower'
  | 'mustContainNumber'
  | 'mustContainSpecial'
  | 'relations';

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
export function modelValidator<T>(target: T): T & { validate: (options?: validateOptions) => boolean };
export function objectValidator<T>(target: T): T & { validate: (options?: validateOptions) => boolean };

export interface validateOptions {
  except: string[];
  only: string[];
  addErrors: boolean;
}

export interface validationsConfig {
  [key: string]: {
    [K in ValidationKeys]?: any;
  };
}

export interface ValidatedModel {
  validate(options?: validateOptions): boolean;
}

export interface ValidatedObject {
  validate(options?: validateOptions): boolean;
  errors: any;
}
