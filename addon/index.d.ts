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
 * By including Ember-model-validator's decorator into your model, this will add a `validate()` function available,
 * it is a synchronous function which returns either true or false.
 * You can also pass an option hash for excluding or forcing certain attributes to be validated, and to prevent
 * errors to be added.
 */
export function modelValidator<T>(target: T): T & { validate: (options?: ValidateOptions) => boolean };
export function objectValidator<T>(target: T): T & { validate: (options?: ValidateOptions) => boolean };

export interface ValidateOptions {
  except: string[];
  only: string[];
  addErrors: boolean;
}

export interface ValidationsConfig {
  [key: string]: {
    [K in ValidationKeys]?: any;
  };
}

export interface ValidatedModel {
  validate(options?: ValidateOptions): boolean;
}

export interface ValidatedObject {
  validate(options?: ValidateOptions): boolean;
  errors: any;
}
