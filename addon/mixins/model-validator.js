import Ember from 'ember';
import Messages from 'ember-model-validator/messages';

export default Ember.Mixin.create({

	validationErrors: {},
  isValidNow: true,

  validate: function(options) {
    var store = this.get('store'),
    		errors = null,
    		validations = this.get('validations');

    if (options == null) {
      options = {};
    }

  	// Clean all the current errors
    this.get('errors').clear();
    this.set('validationErrors',{});
    this.set('isValidNow',true);
    errors = this.get('validationErrors');

    // Call validators defined on each property
		for (var property in validations) {
			for (var validation in validations[property]) {
        if (this._exceptOrOnly(property,options)) {
          var validationName = (validation.charAt(0).toUpperCase() + validation.slice(1));
          this[`_validate${validationName}`](property, validations[property]);
        }
			}
		}

    // Check if it's valid or not
    if (!this.get('isValidNow')) {
      // It may be invalid because of its relations
      if(Object.keys(errors).length !== 0){
        this.transitionTo('updated.uncommitted');
        store.recordWasInvalid(this, errors);
      }
      return false;
    }else{
      return true;
    }
  },

  /**** Validators ****/
  _validatePresence: function(property, validation) {
    if (Ember.isBlank(this.get(property))){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.presence, Messages.presenceMessage);
    }
  },
  _validateAbsence: function(property, validation) {
    if (Ember.isPresent(this.get(property))){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.absence, Messages.absenceMessage);
    }
  },
  _validateAcceptance: function(property,validation){
    var propertyValue = this.get(property),
        accept =  validation.acceptance.accept || [1,'1', true];
    if(!Ember.A(accept).contains(propertyValue)){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.acceptance, Messages.acceptanceMessage);
    }
  },
  _validateFormat: function(property, validation) {
    var withRegexp = validation.format.with;
    if (!this.get(property) || String(this.get(property)).match(withRegexp) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.format, Messages.formatMessage);
    }
  },
  _validateEmail: function(property, validation) {
    if (!this.get(property) || String(this.get(property)).match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.email, Messages.mailMessage);
    }
  },
  _validateZipCode: function(property, validation) {
    var propertyValue = this.get(property);
    if (!propertyValue || String(propertyValue).match(/^\b\d{5}(-\d{4})?\b$/i) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.zipCode, Messages.zipCodeMessage);
    }
  },
  _validateColor: function(property, validation) {
    var propertyValue = this.get(property);
    if (!propertyValue || String(propertyValue).match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.color, Messages.colorMessage);
    }
  },
  _validateURL: function(property, validation) {
    var propertyValue = this.get(property);
    if (!propertyValue || String(propertyValue).match(/^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.URL, Messages.URLMessage);
    }
  },
  _validateSubdomain: function(property, validation) {
    var propertyValue = this.get(property),
        reserved = validation.subdomain.reserved || [];
    if (!propertyValue || String(propertyValue).match(/^[a-z\d]+([-_][a-z\d]+)*$/i) === null || reserved.indexOf(propertyValue) !== -1){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.subdomain, Messages.subdomainMessage);
    }
  },
  _validateNumericality: function(property, validation) {
    if (!this._isNumber(this.get(property))){
      this.set('isValidNow',false);
    	this._addToErrors(property, validation.numericality, Messages.numericalityMessage);
    }
  },
  _validateExclusion: function(property, validation) {
    if(validation.exclusion.hasOwnProperty('in')) {
      if(validation.exclusion.in.indexOf(this.get(property)) !== -1){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.exclusion, Messages.exclusionMessage);
      }
    }
  },
  _validateInclusion: function(property, validation) {
    if(validation.inclusion.hasOwnProperty('in')) {
      if(validation.inclusion.in.indexOf(this.get(property)) === -1){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.inclusion, Messages.inclusionMessage);
      }
    }
  },
  _validateRelations: function(property, validation) {
    var  _this = this;
    if(validation.relations.indexOf("hasMany") !== -1) {
      if(this.get(property)){
        this.get(property).forEach(function(objRelation) {
          if(!objRelation.validate()){
            _this.set('isValidNow',false);
          }
        });
      }
    }else if(validation.relations.indexOf("belongsTo") !== -1){
      if(this.get(property) && !this.get(property).validate()){
        this.set('isValidNow',false);
      }
    }
  },
	_validateMustContainCapital: function(property, validation) {
		var notContainCapital = String(this.get(property)).match(/(?=.*[A-Z])/) === null;
		var message = validation.mustContainCapital.message || Messages.mustContainCapitalMessage;

		if (validation.mustContainCapital && notContainCapital) {
			this.set('isValidNow', false);
      this._addToErrors(property, validation, message);
		}
	},
	_validateMustContainLower: function(property, validation) {
		var containsLower = String(this.get(property)).match(/(?=.*[a-z])/) !== null;
		var message = validation.mustContainLower.message || Messages.mustContainLowerMessage;

		if (validation.mustContainLower && !containsLower) {
			this.set('isValidNow', false);
      this._addToErrors(property, validation, message);
		}
	},
	_validateMustContainNumber: function(property, validation) {
		var containsNumber = String(this.get(property)).match(/(?=.*[0-9])/) !== null;
		var message = validation.mustContainNumber.message || Messages.mustContainNumberMessage;

		if (validation.mustContainNumber && !containsNumber) {
			this.set('isValidNow', false);
			this._addToErrors(property, validation, message);
		}
	},
	_validateMustContainSpecial: function(property, validation) {
		var regexString = validation.mustContainSpecial.acceptableChars || '-+_!@#$%^&*.,?()';
		var regex = new RegExp(`(?=.*[${regexString}])`);
		var containsSpecial = String(this.get(property)).match(regex) !== null;
		var message = validation.mustContainSpecial.message || Messages.mustContainSpecialMessage;

		if (validation.mustContainSpecial && !containsSpecial) {
			this.set('isValidNow', false);
			this._addToErrors(property, validation, message.fmt(regexString));
		}
	},
	_validateMinLength: function(property, validation) {
		var minLength = validation.minLength.value;
		var hasThisValidation = validation.hasOwnProperty('minLength');
		var message = validation.minLength.message || Messages.minLengthMessage;

		if (hasThisValidation && this.get(property).length < minLength) {
			this.set('isValidNow', false);
			this._addToErrors(property, validation, message.fmt(minLength));
		}
	},
	_validateMaxLength: function(property, validation) {
		var maxLength = validation.maxLength.value;
		var hasThisValidation = validation.hasOwnProperty('maxLength');
		var message = validation.maxLength.message || Messages.maxLengthMessage;

		if (hasThisValidation && this.get(property).length > maxLength) {
			this.set('isValidNow', false);
			this._addToErrors(property, validation, message.fmt(maxLength));
		}
	},

  /**** Helper methods ****/
  _exceptOrOnly: function(property, options) {
    var validateThis = true;
    if(options.hasOwnProperty('except') && options.except.indexOf(property) !== -1){ validateThis = false; }
    if(options.hasOwnProperty('only') && options.only.indexOf(property) === -1){ validateThis = false; }
    return validateThis;
  },
  _getCustomMessage: function(validationObj,defaultMessage) {
    if (this._isThisAnObject(validationObj) && validationObj.hasOwnProperty('message')) {
      return validationObj.message;
    }else{
      return defaultMessage;
    }
  },
  _addToErrors: function(property, validation, defaultMessage) {
    var errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation, defaultMessage),
        errorAs =  validation.errorAs || property;
    if (!Ember.isArray(errors[errorAs])) {errors[errorAs] = [];}
    errors[errorAs].push([message]);
  },
	_isNumber: function (n) {
  	return !isNaN(parseFloat(n)) && isFinite(n);
	},
  _isThisAnObject: function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
});
