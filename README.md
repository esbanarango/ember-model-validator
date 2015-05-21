# Ember-model-validator
[![Build Status](https://travis-ci.org/esbanarango/ember-model-validator.svg?branch=master)](https://travis-ci.org/esbanarango/ember-model-validator)

[`ember-cli`](http://www.ember-cli.com/) package, which adds validation support to your Ember-Data models.

This README outlines the details of collaborating on this Ember addon.

## Purpose
This Ember cli addons borns from the necessity of having some sort of similar validation support like we have on Rails with _Active Record Validations_.

## Installation

Install __Ember-model-validator__ is easy as:

`npm install ember-model-validator --save-dev`

## Validators

> All of validators accept the message: option, which will overwrite the default messages.

- [Presence](#presence)
- [Format](#format)
- [Email](#email)
- [Color](#hex-color)
- [Subdomain](#subdomain)
- [Inclusion](#inclusion)
- [Exclusion](#exclusion)
- [Numericality](#numericality)
- ___[Relations](#relations)___


### Presence
A value is not present if it is empty or a whitespace string. It uses [Ember.isBlank](http://emberjs.com/api/#method_isBlank) method.

````js
  validations: {
    name: {
      presence: true
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
This validator will run the `validate()` function for the specific relation. If it's a `DS.hasMany` relation then it will loop throught all.
> Note: The relations __have__ to be [`embedded`](http://emberjs.com/api/data/classes/DS.EmbeddedRecordsMixin.html).

````js
  validations: {
    myHasManyRelation:{
      relations: ['hasMany']
    }
  }
````


## Usage Example
__Ember-model-validator__ provides a mixin to be included in your models for adding validation support. This mixin can be imported from your app's namespace (e.g. ../mixins/model-validator in your models):

````js
import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator,{
  name: DS.attr('string'),
  secondName: DS.attr('string'),
  email: DS.attr('string'),
  bussinessEmail: DS.attr('string'),
  favoritColor: DS.attr('string'),
  legacyCode: DS.attr('string'),
  mainstreamCode: DS.attr('string'),
  lotteryNumber: DS.attr('number'),
  alibabaNumber: DS.attr('number'),

  mySubdomain: DS.attr('number'),

  otherFakes: DS.hasMany('other-model'),

  validations: {
    name: {
      presence: true,
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'], message: 'Solo verde a morir' }
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
