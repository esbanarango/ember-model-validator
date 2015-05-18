# Ember-model-validator
[![Build Status](https://travis-ci.org/esbanarango/ember-model-validator.svg?branch=master)](https://travis-ci.org/esbanarango/ember-model-validator)

[`ember-cli`](http://www.ember-cli.com/) package, which adds validation support to your Ember-Data models.

This README outlines the details of collaborating on this Ember addon.

## Purpose
This Ember cli addons borns from the necessity of having some sort of similar validation support like we have on Rails with _Active Record Validations_.

## Installation

Install __Ember-model-validator__ is easy as:

`npm install ember-model-validator --save-dev`

## Usage
__Ember-model-validator__ provides a mixin to be included in your models for adding validation support. This mixin can be imported from your app's namespace (e.g. ../mixins/validator in your models):

````js
import DS from 'ember-data';
import Validator from '../mixins/validator';

export default DS.Model.extend(Validator,{
  name: DS.attr('string'),
  email: DS.attr('string'),

  legacyCode: DS.attr('string'),
  lotteryNumber: DS.attr('number'),

  otherFakes: DS.hasMany('other-model'),

  validations: {
    name: {
      presence: true,
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'] }
    },
    email: {
      presence: true,
      email: true
    },
    legacyCode:{
      format: {with: /^[a-zA-Z]+$/}
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
