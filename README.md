# Ember-model-validator
[![Build Status](https://travis-ci.org/esbanarango/ember-model-validator.svg?branch=master)](https://travis-ci.org/esbanarango/ember-model-validator) [![npm version](https://badge.fury.io/js/ember-model-validator.svg)](http://badge.fury.io/js/ember-model-validator) [![Ember Observer Score](http://emberobserver.com/badges/ember-model-validator.svg)](http://emberobserver.com/addons/ember-model-validator)

[`ember-cli`](http://www.ember-cli.com/) package, which adds validation support to your Ember-Data models.

This README outlines the details of collaborating on this Ember addon.

## Purpose
This Ember cli addon borns from the necessity of having some sort of similar validation support like we have on Rails with _Active Record Validations_.

## Installation

Install __Ember-model-validator__ is easy as:

`npm install ember-model-validator --save-dev`

## Validators

- [Presence](#presence)
- [Acceptance](#acceptance)
- [Absence](#absence)
- [Format](#format)
- [Length](#length)
- [Email](#email)
- [Color](#hex-color)
- [ZipCode](#zipcode)
- [Subdomain](#subdomain)
- [URL](#url)
- [Inclusion](#inclusion)
- [Exclusion](#exclusion)
- [Numericality](#numericality)
- [Date](#date)
- [Match](#match)
- [Password*](#password)
- [CustomValidation](#custom)
- ___[Relations](#relations)___


##### Common options

All validators accept the following options
  - `message` _option_. Overwrites the default message, it can be a String or a [function](#using-function-to-generate-custom-message) that returns a string.
  - `errorAs` _option_. Sets the _key_ name to be used when adding errors (default to property name).
  - `allowBlank` _option_. If set to `true` and the value is blank as defined by [Ember.isBlank](http://emberjs.com/api/#method_isBlank), all other validations for the field are skipped.

### Presence
A value is not present if it is empty or a whitespace string. It uses [Ember.isBlank](http://emberjs.com/api/#method_isBlank) method. This can be also used on __async__ `belongsTo` relations.

````js
  validations: {
    name: {
      presence: true
    }
  }
````

### Acceptance
These values: `['1', 1, true]` are the acceptable values. But you can specify yours with the `accept` option.

````js
  validations: {
    acceptConditions: {
      acceptance: {accept: 'yes'}
    }
  }
````
> The `accept` option receives either a string or an array of acceptable values.

### Absence
Validates that the specified attributes are absent. It uses [Ember.isPresent](http://emberjs.com/api/#method_isPresent) method.

````js
  validations: {
    login: {
      absence: true
    }
  }
````

### Format
Speficy a Regexp to validate with. It uses the [match()](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/match) method from String.

````js
  validations: {
    legacyCode:{
      format: { with: /^[a-zA-Z]+$/ }
    }
  }
````

### Length
Speficy the lengths that are allowed.

##### Options
  - A `number`. The exact length of the value allowed (Alias for `is`).
  - An `array`. Will expand to `minimum` and `maximum`. First element is the lower bound, second element is the upper bound.
  - `is` _option_. The exact length of the value allowed.
  - `minimum` _option_. The minimum length of the value allowed.
  - `maximum` _option_. The maximum length of the value allowed.

````js
  validations: {
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
````

### Email
Validates the proper format of the email.

````js
  validations: {
    email: {
      email: true
    }
  }
````

### ZipCode
The value must be a correct zipcode. The `countryCode` is optional and defaults to 'US'.

Countries supported and regular expressions used can be found in [postal-codes-regex.js](addon/postal-codes-regex.js)
##### Options
  - `countryCode` _option_. The code of the country for which the postal code will be validated.

````js
  validations: {
    postalCode:{
    // If no countryCode is specified, 'US' is used as default
      zipCode: true
    }
  }
````
````js
  validations: {
    postalCodeUK:{
      zipCode: {countryCode: 'UK'}
    }
  }
````

### Hex Color
The value must be a correct Hexadecimal color.

````js
  validations: {
    favoritColor:{
      color: true
    }
  }
````

### Subdomain
The value must a well formatted subdomain. Here you can also specify reserved words.

````js
  validations: {
    mySubdomain:{
      subdomain:{ reserved:['admin','blog'] }
    }
  }
````

### URL
The value must a well formatted URL.

````js
  validations: {
    myBlog: {
      URL: true
    }
  }
````

### Inclusion
The value has to be included in a given set.

````js
  validations: {
    name:{
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'] }
    }
  }
````

### Exclusion
The value can't be included in a given set.

````js
  validations: {
    name:{
      exclusion: { in: ['Gionvany Hernandez', 'Wilder Medina'] }
    }
  }
````

### Match
Speficy the attribute to match with.

##### Options
  - A `string`. The name of the attribute to match with  (Alias for `attr`).
  - `attr` _option_. The name of the attribute to match with.
````js
  validations: {
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
````

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

````js
  validations: {
    lotteryNumber:{
      numericality: true
    }
  }
````

### Date
The value must be a `Date` object or a string that produces a valid date when passed to the `Date` constructor.

##### Options
  - `before` _option_. The value must be before the supplied date.
  - `after` _option_. The value must be after the supplied date.


````js
  validations: {
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
````

### Custom
Define a custom callback function to validate the model's value. The validation callback is passed 3 values: the _key_, _value_, _model's scope_. return true (or a truthy value) to pass the validation, return false (or falsy value) to fail the validation.

````js
  validations: {
    lotteryNumber: {
      custom: function(key, value, model){
        return model.get('accountBalance') > 1 ? true : false;
      }
    }
  }
````

this has the same action as above except will use a custom message instead of the default.
````js
  validations: {
    lotteryNumber: {
      custom: {
        validation: function(key, value, model){
          return model.get('accountBalance') > 1 ? true : false;
        },
        message: 'You can\'t win off of good looks and charm.'
      }
    }
  }
````

to have multiple custom validation functions on the same property, give 'custom' an array of either of the two syntax above.
````js
  validations: {
    lotteryNumber: {
      custom: [
        {
          validation: function(key, value, model){
            return model.get('accountBalance') > 1 ? true : false;
          },
          message: 'You can\'t win off of good looks and charm.'
        },
        {
          validation: function(key, value, model){
            return model.get('accountBalance') > 1 ? true : false;
          },
          message: 'You can\'t win off of good looks and charm.'
        }
      ]
    }
  }
````

### Password
A set of validators which are especially useful for validating passwords. Be aware that these all of these password-aimed validations will work standalone and carry the same [common options](#common-options) with the rest of the validations. They don't only work for passwords!

- `mustContainCapital` (capital case character).
- `mustContainLower` (lower case character).
- `mustContainNumber`
- `mustContainSpecial`
- `length` (explained in-depth [above](#length)).

````js
validations: {
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

````

### Relations
This validator will run the `validate()` function for the specific relation. If it's a `DS.hasMany` relation then it will loop through all objects.
> Note: The relations __have__ to be [`embedded`](http://emberjs.com/api/data/classes/DS.EmbeddedRecordsMixin.html) or the promise has to be already resolved.

````js
  validations: {
    myHasManyRelation:{
      relations: ['hasMany']
    },
    myBelongsToRelation:{
      relations: ['belongsTo']
    }
  }
````

### Using function to generate custom message

You can pass a function to generate a more specific error message. Some scenarios are:

* When the message varies depending of the attribute value.
* When you want to use model attributes in the message.

The message function receives the attribute name, the value of the attribute and the model itself.

**NOTE:** If the function doesn't return a string the default message is going to be used.

##### Example

````js
import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator,{

  otherCustomAttribute: DS.attr('number', { defaultValue:  12345 }),

  validations: {
    otherCustomAttribute: {
      custom: {
        validation: function(key, value){
          return value.toString().length === 5 ? true : false;
        },
        message: function(key,value, _this){
          return key + " must have exactly 5 digits";
        }
      }
    }
  }

});

````


## Usage
__Ember-model-validator__ provides a mixin to be included in your models for adding validation support. This mixin can be imported from your app's namespace (e.g. `../mixins/model-validator` in your models).

By including __Ember-model-validator's__ mixin into your model, this will have a `validate` function available, it is a _synchronous_ function which returns either __true__ or __false__.

You can also pass an _option_ hash for excluding or forcing certain attributes to be validated, and to prevent errors to be added.

````js
//Using `except`
myModel.validate({except:['name', 'cellphone']});

//Using `only`
myModel.validate({only:['favoritColor', 'mainstreamCode']});

//Using `addErrors`
myModel.validate({addErrors:false});
// This will validate the model but won't add any errors.

````

## Usage Example


````js
import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator,{

  name: DS.attr('string'),
  login: DS.attr('string'),
  secondName: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  passwordConfirmation: DS.attr('string'),
  bussinessEmail: DS.attr('string', {defaultValue: 'donJoseRene@higuita.com'}),
  favoritColor: DS.attr('string', {defaultValue: '423abb'}),
  legacyCode: DS.attr('string'),
  mainstreamCode: DS.attr('string', {defaultValue: 'hiphopBachatudo'}),
  lotteryNumber: DS.attr('number'),
  alibabaNumber: DS.attr('number'),
  anInteger: DS.attr('number', {defaultValue: 111}),
  anIntegerGreaterThan4: DS.attr('number', {defaultValue: 5}),
  anIntegerLessThan4: DS.attr('number', {defaultValue: 3}),
  anIntegerGreaterThanOrEqual7: DS.attr('number', {defaultValue: 7}),
  anIntegerLessThanOrEqual6: DS.attr('number', {defaultValue: 6}),
  aTenNumber: DS.attr('number', {defaultValue: 10}),
  anOddNumber: DS.attr('number', {defaultValue: 3}),
  anEvenNumber: DS.attr('number', {defaultValue: 2}),
  anOptionalNumber: DS.attr('number', {defaultValue: null}),
  acceptConditions: DS.attr('boolean', {defaultValue: true}),
  socialSecurity: DS.attr('number', {defaultValue: 12345}),
  nsaNumber: DS.attr('number', {defaultValue: 1234}),
  chuncaluchoNumber: DS.attr('number', {defaultValue: 1234567891}),
  hugeName: DS.attr('string', {defaultValue: 12345}),
  postalCode:  DS.attr('string', {defaultValue: '09011'}),
  mySubdomain: DS.attr('string', {defaultValue: 'fake_subdomain'}),
  myBlog: DS.attr('string', {defaultValue: 'http://esbanarango.com'}),
  otherFakes: DS.hasMany('other-model'),
  otherFake: DS.belongsTo('other-model'),
  asyncModel: DS.belongsTo('async-model',{async: true}),
  thing: DS.attr(''),
  otherCustomValidation: DS.attr('number', { defaultValue:  12345 }),
  otherCustomValidationBadMessageFunction: DS.attr('number', { defaultValue:  12345 }),

  validations: {
    asyncModel: {
      presence: true
    },
    name: {
      presence: { errorAs:'profile.name' },
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'], message: 'Solo verde a morir' }
    },
    login: {
      absence: true
    },
    secondName: {
      exclusion: { in: ['Gionvany Hernandez', 'Wilder Medina'], message: 'Que iNrresponsabilidad' }
    },
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
        maximum: 5,
      }
    },
    bussinessEmail: {
      presence: { message: 'sup dude, where\'s da email' },
      email: { message: 'Be professional ma men' }
    },
    favoritColor:{
      color: { message: 'not a hex color' }
    },
    email: {
      presence: true,
      email: true
    },
    password: {
      custom: function(key, value, _this){
        return String(value) === String(_this.get('socialSecurity')) ? false : true;
      },
      match: 'passwordConfirmation',
      mustContainCapital: true,
      mustContainLower: true,
      mustContainNumber: true,
      mustContainSpecial: true
    },
    thing: {
      custom: [
        {
          validation: function(key, value, _this){
            return (value !== 'blahblahblahblahbthishouldneverfaillahblahblah');
          }
        },
        {
          validation: function(key, value, _this){
            return (value !== 'fail');
          }
        }
      ]
    },
    mySubdomain:{
      subdomain:{ reserved:['admin','blog'], message: 'this subdomain is super invalid' }
    },
    myBlog: {
      URL: true
    },
    mainstreamCode: {
      format: { with: /^[a-zA-Z]+$/, message: 'nu nu, that\'s not the format' }
    },
    legacyCode:{
      format: { with: /^[a-zA-Z]+$/ }
    },
    anInteger:{
      numericality: {onlyInteger: true }
    },
    anIntegerLessThan4:{
      numericality: {lessThan: 4}
    },
    anIntegerGreaterThan4:{
      numericality: {greaterThan: 4}
    },
    anIntegerGreaterThanOrEqual7:{
      numericality: {greaterThanOrEqualTo: 7}
    },
    anIntegerLessThanOrEqual6:{
      numericality: {lessThanOrEqualTo: 6}
    },
    aTenNumber:{
      numericality: {equalTo: 10}
    },
    anOddNumber:{
      numericality: {odd: true}
    },
    anEvenNumber:{
      numericality: {even: true}
    },
    anOptionalNumber:{
      numericality: {onlyInteger: true, allowBlank: true}
    },
    alibabaNumber: {
      numericality: {message: 'is not abracadabra' }
    },
    lotteryNumber: {
      numericality: true,
      custom: {
        validation: function(key, value, _this){
          var favColor = _this.get('favoriteColor');
          return !!favColor;
        },
        message: 'must have a favorite color to play the lotto, duh'
      }
    },
    acceptConditions: {
      acceptance: true
    },
    postalCode:{
      zipCode: true
    },
    otherFakes:{
      relations: ['hasMany']
    },
    otherFake:{
      relations: ['belongsTo']
    },
    otherCustomValidation: {
      custom: {
        validation: function(key, value){
          return value.toString().length === 5 ? true : false;
        },
        message: function(key,value, _this){
          return key + " must have exactly 5 digits";
        }
      }
    },
    otherCustomValidationBadMessageFunction: {
      custom: {
        validation: function(key, value){
          return value.toString().length === 5 ? true : false;
        },
        message: function(key, value, _this){
          return 12345;
        }
      }
    }
  }

});

`````
After setting the validations on your model you will be able to:

````js
import Ember from 'ember';

export default Ember.Route.extend(
  {
    actions: {
      saveFakeModel: function() {
        var _this = this,
            fakeModel = this.get('model');

        if(fakeModel.validate()){
          fakeModel.save().then(
            // Success
            function() {
              // Alert success
              console.log('ooooh yeah we just saved the FakeModel...');
            },

            // Error handling
            function(error) {
              // Alert failure
              console.log('There was a problem saving the FakeModel...');
              console.log(error);
            }
          );
        }else{
          fakeModel.get('errors');
        }
      },
    }
  }
);
````

## Donating
Support this project and [others by esbanarango][gratipay-esbanarango] via [gratipay][gratipay-esbanarango].

[![Support via Gratipay][gratipay]][gratipay-esbanarango]

[gratipay]: https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.png
[gratipay-esbanarango]: https://gratipay.com/esbanarango/

## Running Tests

* `npm test` (Runs `ember try:testall` to test the addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
