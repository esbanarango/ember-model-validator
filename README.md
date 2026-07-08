# Ember model validator

![Download count all time](https://img.shields.io/npm/dt/ember-model-validator.svg) [![CI](https://github.com/esbanarango/ember-model-validator/actions/workflows/ci.yml/badge.svg)](https://github.com/esbanarango/ember-model-validator/actions/workflows/ci.yml) [![Ember Observer Score](http://emberobserver.com/badges/ember-model-validator.svg)](http://emberobserver.com/addons/ember-model-validator)

### [Live demo & Documentation](http://esbanarango.github.io/ember-model-validator/)

Add validations to your _Ember Data_ models on an explicit and easy way, without a bunch a validations files around or complicated structure.

This README outlines the details of collaborating on this Ember addon.

## Purpose

This Ember addon was born from the necessity of having a validation support for models similar to [_Active Record Validations_](http://guides.rubyonrails.org/active_record_validations.html) on the Ruby on Rails land.

## Installation

Install **Ember-model-validator** is easy as:

`npm install ember-model-validator --save-dev`
or
`yarn add ember-model-validator --dev`

## Compatibility

* `ember-source` >= v3.28 and <= 6.2
* `ember-data` v3.28 or above

## Usage

**Ember-model-validator** provides a decorator to be included in your models for adding validation support. This decorator can be imported from your app's namespace (e.g. `import { modelValidator, objectValidator } from 'ember-model-validator';` in your models).

By including **Ember-model-validator's** decorator into your model, this will have a `validate` function available, it is a _synchronous_ function which returns either **true** or **false**.

You can also pass an _option_ hash for excluding or forcing certain attributes to be validated, and to prevent errors to be added.

```js
// Using `except`
myModel.validate({ except: ['name', 'cellphone'] });

// Using `only`
myModel.validate({ only: ['favoriteColor', 'mainstreamCode'] });

// Using `addErrors`
myModel.validate({ addErrors: false });
// ^ This will validate the model but won't add any errors.
```

To target specific validations when using `except`/`only`, pass the validations' names along the attribute's name:

```js
// This runs all validations, except name's presence and length validations and
// any email validations.
// Other name validations are still run.
myModel.validate({ except: ['name:presence,length', 'email'] });
```

### Usage Example

```js
import Model, { attr } from '@ember-data/model';
import { modelValidator } from 'ember-model-validator';

@modelValidator
export default class MyModel extends Model {
  @attr('string') fullName;
  @attr('string') fruit;
  @attr('string') favoriteColor;

  validations = {
    fullName: {
      presence: true
    },
    fruit: {
      presence: true
    },
    favoriteColor: {
      color: true
    }
  };
}
```

After setting the validations on your model you will be able to:

```js
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MyController extends Controller {
  @action
  async saveFakeModel() {
    const fakeModel = this.model;

    if (fakeModel.validate()) {
      await fakeModel.save();
    } else {
      console.log({ errors: fakeModel.get('errors') });
    }
  }
}
```

### Or Usage in non Model(Controller, Componente, Object ...) Example

```js
import Component from '@ember/component';
import { objectValidator } from 'ember-model-validator';

@objectValidator
export default class MyComponent extends Component {
  test = 'ABC',

  validations = {
    test: {
      presence: true
    }
  }
};
```

### TypeScript
```typescript
import Model, { attr } from '@ember-data/model';

import { modelValidator, type ValidationsConfig, type ValidatedModel } from 'ember-model-validator';

// https://github.com/microsoft/TypeScript/issues/4881
interface MyModel extends ValidatedModel, Model {}

@modelValidator
class MyModel extends Model {
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

export default MyModel;

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'my-model': MyModel;
  }
}

```

---

- [Ember model validator](#ember-model-validator)
    - [Live demo \& Documentation](#live-demo--documentation)
  - [Purpose](#purpose)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Usage Example](#usage-example)
    - [Or Usage in non Model(Controller, Componente, Object ...) Example](#or-usage-in-non-modelcontroller-componente-object--example)
    - [TypeScript](#typescript)
  - [Compatibility](#compatibility)
  - [Validators](#validators)
        - [Common options](#common-options)
    - [Presence](#presence)
    - [Acceptance](#acceptance)
    - [Absence](#absence)
    - [Format](#format)
    - [Length](#length)
        - [Options](#options)
    - [Email](#email)
    - [ZipCode](#zipcode)
        - [Options](#options-1)
    - [Hex Color](#hex-color)
    - [Subdomain](#subdomain)
    - [URL](#url)
    - [Inclusion](#inclusion)
    - [Exclusion](#exclusion)
    - [Match](#match)
        - [Options](#options-2)
    - [Numericality](#numericality)
        - [Options](#options-3)
    - [Date](#date)
        - [Options](#options-4)
    - [Custom](#custom)
    - [Password](#password)
    - [Relations](#relations)
    - [Using function to generate custom message](#using-function-to-generate-custom-message)
        - [Example](#example)
  - [I18n](#i18n)
  - [Running Tests](#running-tests)

## Validators

##### Common options

All validators accept the following options

- `message` _option_. Overwrites the default message, it can be a String (with a `{value}` in it for value interpolation) or a [function](#using-function-to-generate-custom-message) that returns a string.
- `errorAs` _option_. Sets the _key_ name to be used when adding errors (default to property name).
- `allowBlank` _option_. If set to `true` and the value is blank as defined by [Ember.isBlank](https://emberjs.com/api/ember/3.0/functions/@ember%2Futils/isBlank), all other validations for the field are skipped.
- `if` _option_. Validates **only** when the function passed returns true. `function(key,value, _this){...}`.

### Presence

A value is not present if it is empty or a whitespace string. It uses [Ember.isBlank](https://emberjs.com/api/ember/3.0/functions/@ember%2Futils/isBlank) method. This can be also used on **async** `belongsTo` relations.

```js
validations = {
  name: {
    presence: true;
  }
}
```

### Acceptance

These values: `['1', 1, true]` are the acceptable values. But you can specify yours with the `accept` option.

```js
validations = {
  acceptConditions: {
    acceptance: {
      accept: 'yes';
    }
  }
}
```

> The `accept` option receives either a string or an array of acceptable values.

### Absence

Validates that the specified attributes are absent. It uses [Ember.isPresent](https://emberjs.com/api/ember/3.0/functions/@ember%2Futils/isPresent) method.

```js
validations = {
  login: {
    absence: true;
  }
}
```

### Format

Specify a Regex to validate with. It uses the [match()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/match) method from String.

```js
  validations = {
    legacyCode:{
      format: { with: /^[a-zA-Z]+$/ }
    }
  }
```

### Length

Specify the lengths that are allowed.

##### Options

- A `number`. The exact length of the value allowed (Alias for `is`).
- An `array`. Will expand to `minimum` and `maximum`. First element is the lower bound, second element is the upper bound.
- `is` _option_. The exact length of the value allowed.
- `minimum` _option_. The minimum length of the value allowed.
- `maximum` _option_. The maximum length of the value allowed.

```js
  validations = {
    socialSecurity: {
      length: 5
    },
    nsaNumber: {
      length: [3, 5]
    },
    chuncaluchoNumber: {
      length: { is: 10, message: 'this is not the length of a chuncalucho' }
    },
    hugeName:{
      length: {
        minimum: 3,
        maximum: 5
      }
    },
    smallName:{
      length: {
        maximum: {
          value: 3,
          message: 'should be smaller'
        }
      }
    }
  }
```

### Email

Validates the proper format of the email.

```js
  validations = {
    email: {
      email: true
    }
  }
```

### ZipCode

The value must be a correct zipcode. The `countryCode` is optional and defaults to 'US'.

Countries supported and regular expressions used can be found in [postal-codes-regex.js](addon/postal-codes-regex.js)

##### Options

- `countryCode` _option_. The code of the country for which the postal code will be validated.

```js
validations = {
  postalCode: {
    // If no countryCode is specified, 'US' is used as default
    zipCode: true;
  }
}
```

```js
validations = {
  postalCodeUK: {
    zipCode: {
      countryCode: 'UK';
    }
  }
}
```

### Hex Color

The value must be a correct Hexadecimal color.

```js
validations = {
  favoriteColor: {
    color: true;
  }
}
```

### Subdomain

The value must a well formatted subdomain. Here you can also specify reserved words.

```js
validations = {
  mySubdomain: {
    subdomain: {
      reserved: ['admin', 'blog'];
    }
  }
}
```

### URL

The value must a well formatted URL.

```js
validations = {
  myBlog: {
    URL: true;
  }
}
```

### Inclusion

The value has to be included in a given set.

```js
  validations = {
    name:{
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'] }
    }
  }
```

### Exclusion

The value can't be included in a given set.

```js
  validations = {
    name:{
      exclusion: { in: ['Gionvany Hernandez', 'Wilder Medina'] }
    }
  }
```

### Match

Specify the attribute to match with.

##### Options

- A `string`. The name of the attribute to match with (Alias for `attr`).
- `attr` _option_. The name of the attribute to match with.

```js
  validations = {
    email:{
      match: 'confirmationEmail'
    },
    password:{
      match: {
        attr: 'passwordConfirmation',
        message: 'sup, it is not the same!'
      }
    }
  }
```

### Numericality

The value has to have only numeric values.

##### Options

- `onlyInteger` _option_. The value must be an integer.
- `greaterThan` _option_. The value must be greater than the supplied value.
- `greaterThanOrEqualTo` _option_. The value must be greater or equal to the supplied value.
- `equalTo` _option_. The value must be equal to the supplied value.
- `lessThan` _option_. The value must be less than the supplied value.
- `lessThanOrEqualTo` _option_. The value must be less or equal to the supplied value.
- `odd` _option_. The value must be odd.
- `even` _option_. The value must be even.

```js
validations = {
  lotteryNumber: {
    numericality: true;
  }
}
```

### Date

The value must be a `Date` object or a string that produces a valid date when passed to the `Date` constructor.

##### Options

- `before` _option_. The value must be before the supplied date.
- `after` _option_. The value must be after the supplied date.

```js
  validations = {
    birthDate: {
      date: {
        before: new Date()
      }
    },
    signupDate: {
      date: {
        after: '2015-01-01'
      }
    }
  }
```

### Custom

Define a custom callback function to validate the model's value. The validation callback is passed 3 values: the _key_, _value_, _model's scope_. return true (or a truthy value) to pass the validation, return false (or falsy value) to fail the validation.

```js
  validations = {
    lotteryNumber: {
      custom: function(key, value, model){
        return model.get('accountBalance') > 1 ? true : false;
      }
    }
  }
```

this has the same action as above except will use a custom message instead of the default.

```js
  validations = {
    lotteryNumber: {
      custom: {
        validation: function(key, value, model){
          return model.get('accountBalance') > 1 ? true : false;
        },
        message: 'You can\'t win off of good looks and charm.'
      }
    }
  }
```

to have multiple custom validation functions on the same property, give 'custom' an array of either of the two syntax above.

```js
validations = {
  lotteryNumber: {
    custom: [
      {
        validation: function(key, value, model) {
          return model.get('accountBalance') > 1 ? true : false;
        },
        message: "You can't win off of good looks and charm."
      },
      {
        validation: function(key, value, model) {
          return model.get('accountBalance') > 1 ? true : false;
        },
        message: "You can't win off of good looks and charm."
      }
    ];
  }
}
```

### Password

A set of validators which are especially useful for validating passwords. Be aware that these all of these password-aimed validations will work standalone and carry the same [common options](#common-options) with the rest of the validations. They don't only work for passwords!

- `mustContainCapital` (capital case character).
- `mustContainLower` (lower case character).
- `mustContainNumber`
- `mustContainSpecial`
- `length` (explained in-depth [above](#length)).

```js
validations = {
  password: {
    presence: true,
    mustContainCapital: true,
    mustContainLower: true,
    mustContainNumber: true,
    mustContainSpecial: {
      message: 'One of these characters is required: %@',
      acceptableChars: '-+_!@#$%^&*.,?()'
    },
    length: {
      minimum: 6
    }
  },
  someOtherThing: {
    mustContainSpecial: true
  }
}
```

### Relations

This validator will run the `validate()` function for the specific relation. If it's a `DS.hasMany` relation then it will loop through all objects.

> Note: The relations **have** to be [`embedded`](http://emberjs.com/api/data/classes/DS.EmbeddedRecordsMixin.html) or the promise has to be already resolved.

```js
  validations = {
    myHasManyRelation:{
      relations: ['hasMany']
    },
    myBelongsToRelation:{
      relations: ['belongsTo']
    }
  }
```

### Using function to generate custom message

You can pass a function to generate a more specific error message. Some scenarios are:

- When the message varies depending of the attribute value.
- When you want to use model attributes in the message.

The message function receives the attribute name, the value of the attribute and the model itself.

**NOTE:** If the function doesn't return a string the default message is going to be used.

##### Example

```js
import Model, { attr } from '@ember-data/model';
import { modelValidator } from 'ember-model-validator';

@modelValidator
export default class MyModel extends Model {
  @attr('number', { defaultValue: 12345 }) otherCustomAttribute;

  validations = {
    otherCustomAttribute: {
      custom: {
        validation: function(key, value) {
          return value.toString().length === 5 ? true : false;
        },
        message: function(key, value, _this) {
          return key + ' must have exactly 5 digits';
        }
      }
    }
  };
}
```

## I18n

Set `validatorDefaultLocale` in your config enviroment a language, for now it's possible use 'en', 'fr', 'es', 'uk', 'hu', 'sr', 'sr-cyrl' or 'pt-br', default is 'en';

```js
//config/environment.js
...
  ENV:{
    ...
    APP:{
      validatorDefaultLocale: 'pt-br'
    }
    ...
  }
...
```

## Running Tests

- `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
- `ember test`
- `ember test --server`

See the [Contributing](CONTRIBUTING.md) guide for details.
