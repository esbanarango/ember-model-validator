# Ember-model-validator
[![Build Status](https://travis-ci.org/esbanarango/ember-model-validator.svg?branch=master)](https://travis-ci.org/esbanarango/ember-model-validator) [![npm version](https://badge.fury.io/js/ember-model-validator.svg)](http://badge.fury.io/js/ember-model-validator) [![Ember Observer Score](http://emberobserver.com/badges/ember-model-validator.svg)](http://emberobserver.com/addons/ember-model-validator)

[`ember-cli`](http://www.ember-cli.com/) package, which adds validation support to your Ember-Data models.

This README outlines the details of collaborating on this Ember addon.

## Purpose
This Ember cli addons borns from the necessity of having some sort of similar validation support like we have on Rails with _Active Record Validations_.

## Installation

Install __Ember-model-validator__ is easy as:

`npm install ember-model-validator --save-dev`

## Validators

- [Presence](#presence)
- [Acceptance](#acceptance)
- [Absence](#absence)
- [Format](#format)
- [Email](#email)
- [Color](#hex-color)
- [ZipCode](#zipcode)
- [Subdomain](#subdomain)
- [Inclusion](#inclusion)
- [Exclusion](#exclusion)
- [Numericality](#numericality)
- ___[Relations](#relations)___

##### Common options

All validators accept the following options
  - `message` _option_. Overwrites the default message.
  - `errorAs` _option_. Sets the _key_ name to be used when adding errors (default to property name).

### Presence
A value is not present if it is empty or a whitespace string. It uses [Ember.isBlank](http://emberjs.com/api/#method_isBlank) method.

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

### Email
Validates the proper fortmat of the email.

````js
  validations: {
    email: {
      email: true
    }
  }
````

### ZipCode
The value must be a correct zipcode. Regexp used `/^\b\d{5}(-\d{4})?\b$/i`.

````js
  validations: {
    postalCode:{
      zipCode: true
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

### Numericality
The value has to have only numeric values.

````js
  validations: {
    lotteryNumber:{
      numericality: true
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

## Usage
__Ember-model-validator__ provides a mixin to be included in your models for adding validation support. This mixin can be imported from your app's namespace (e.g. `../mixins/model-validator` in your models).

By including __Ember-model-validator's__ mixin into your model, this will have a `validate` function available, it is a _synchronous_ function which returns either __true__ or __false__. You can also pass an _option_ hash for excluding or forcing certain attributes to be validated.

````js
//Using `except`
myModel.validate({except:['name', 'cellphone']});

//Using `only`
myModel.validate({only:['favoritColor', 'mainstreamCode']});
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
  bussinessEmail: DS.attr('string'),
  favoritColor: DS.attr('string'),
  legacyCode: DS.attr('string'),
  mainstreamCode: DS.attr('string'),
  lotteryNumber: DS.attr('number'),
  alibabaNumber: DS.attr('number'),
  acceptConditions: DS.attr('boolean'),

  mySubdomain: DS.attr('number'),

  otherFakes: DS.hasMany('other-model'),

  validations: {
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
    mySubdomain:{
      subdomain:{ reserved:['admin','blog'], message: 'this subdomain is super invalid' }
    },
    mainstreamCode: {
      format: { with: /^[a-zA-Z]+$/, message: 'nu nu, that\'s not the format' }
    },
    legacyCode:{
      format: { with: /^[a-zA-Z]+$/ }
    },
    alibabaNumber: {
      numericality: { message: 'is not abracadabra' }
    },
    lotteryNumber: {
      numericality: true
    },
    acceptConditions: {
      acceptance: true
    },
    otherFakes:{
      relations: ['hasMany']
    }
  }

});

`````
After setting the validationces on your model you will be able to:

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

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
