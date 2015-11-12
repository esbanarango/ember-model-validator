import Ember from 'ember';
import Messages from 'ember-model-validator/messages/en';
import PostalCodesRegex from 'ember-model-validator/postal-codes-regex';

export default Ember.Mixin.create({

	validationErrors: {},
  isValidNow: true,
  addErrors: true,

  validate(options={}) {
    let store = this.get('store'),
    		errors = null,
    		validations = this.get('validations');

  	// Clean all the current errors
    this.get('errors').clear();
    this.set('validationErrors', {});
    this.set('isValidNow', true);
    errors = this.get('validationErrors');

    // Validate but not set errors
    if(options.hasOwnProperty('addErrors')){
      this.set('addErrors', options['addErrors']);
    }else{
      this.set('addErrors', true);
    }

    // Call validators defined on each property
		for (var property in validations) {
			for (var validation in validations[property]) {
        if (this._exceptOrOnly(property,options)) {
          let validationName = Ember.String.capitalize(validation);
          if (Ember.get(validations[property], `${validation}.allowBlank`) && Ember.isBlank(this.get(property))) {
            continue;
          }
          this[`_validate${validationName}`](property, validations[property]);
        }
			}
		}

    // Check if it's valid or not
    if (!this.get('isValidNow')) {
      // It may be invalid because of its relations
      if(Object.keys(errors).length !== 0){
        let stateToTransition = this.get('isNew') ? 'created.uncommitted' : 'updated.uncommitted';
        this.transitionTo(stateToTransition);
				let recordModel = this.adapterDidInvalidate ? this : this._internalModel;
        store.recordWasInvalid(recordModel, errors);
      }
      return false;
    }else{
      return true;
    }
  },

  /**** Validators ****/
  _validateCustom: function(property, validation){
		validation = Ember.isArray(validation.custom) ? validation.custom : [validation.custom];
		for (var i = 0; i < validation.length; i++) {
	    let customValidator = this._getCustomValidator(validation[i]);
	    if (customValidator) {
	      let passedCustomValidation = customValidator(property, this.get(property), this);
	      if (!passedCustomValidation) {
	        this.set('isValidNow', false);
	        this._addToErrors(property, validation[i], Messages.customValidationMessage);
	      }
	    }
		}
  },
  _validatePresence: function(property, validation) {
    let propertyValue = this.get(property);
    // If the property is an async relationship.
    if(this._modelRelations() && !Ember.isBlank(this._modelRelations()[property])){
      if(this._modelRelations()[property]['isAsync']){
        propertyValue = this.get(`${property}.content`);
      }
    }
    if(Ember.isBlank(propertyValue)){
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
    let propertyValue = this.get(property),
        accept =  validation.acceptance.accept || [1,'1', true];
    if(!Ember.A(accept).contains(propertyValue)){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.acceptance, Messages.acceptanceMessage);
    }
  },
  _validateFormat: function(property, validation) {
    let withRegexp = validation.format.with;
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
    const DEFAULT_COUNTRY_CODE = 'US';
    let propertyValue = this.get(property);

    let countryCode = DEFAULT_COUNTRY_CODE;
    if(validation.zipCode.hasOwnProperty('countryCode')){
      countryCode = validation.zipCode.countryCode;
    }
    if (Ember.isArray(countryCode)) {
      countryCode.forEach(function(code) {
        let postalCodeRegexp = PostalCodesRegex[code];
        if(typeof postalCodeRegexp === 'undefined'){
          postalCodeRegexp = PostalCodesRegex[DEFAULT_COUNTRY_CODE];
        }
        if (!propertyValue || String(propertyValue).match(postalCodeRegexp) === null){
            this.set('isValidNow',false);
            this._addToErrors(property, validation.zipCode, Messages.zipCodeMessage);
        }
      });
    }else{
      let postalCodeRegexp = PostalCodesRegex[countryCode];
      if(typeof postalCodeRegexp === 'undefined'){
        postalCodeRegexp = PostalCodesRegex[DEFAULT_COUNTRY_CODE];
      }
      if (!propertyValue || String(propertyValue).match(postalCodeRegexp) === null){
          this.set('isValidNow',false);
          this._addToErrors(property, validation.zipCode, Messages.zipCodeMessage);
      }
    }
  },
  _validateColor: function(property, validation) {
    let propertyValue = this.get(property);
    if (!propertyValue || String(propertyValue).match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.color, Messages.colorMessage);
    }
  },
  _validateURL: function(property, validation) {
    let propertyValue = this.get(property);
    if (!propertyValue || String(propertyValue).match(/^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.URL, Messages.URLMessage);
    }
  },
  _validateSubdomain: function(property, validation) {
    let propertyValue = this.get(property),
        reserved = validation.subdomain.reserved || [];
    if (!propertyValue || String(propertyValue).match(/^[a-z\d]+([-_][a-z\d]+)*$/i) === null || reserved.indexOf(propertyValue) !== -1){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.subdomain, Messages.subdomainMessage);
    }
  },
  _validateNumericality: function(property, validation) {
    let propertyValue = this.get(property);
    if(!this._isNumber(this.get(property))){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.numericality, Messages.numericalityMessage);
    }
    if(validation.numericality.hasOwnProperty('onlyInteger') && validation.numericality.onlyInteger){
      if(!(/^[+\-]?\d+$/.test(propertyValue))){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.numericality, Messages.numericalityOnlyIntegerMessage);
      }
    }
    if(validation.numericality.hasOwnProperty('even') && validation.numericality.even){
      if(propertyValue % 2 !== 0){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.numericality, Messages.numericalityEvenMessage);
      }
    }
    if(validation.numericality.hasOwnProperty('odd') && validation.numericality.odd){
      if(propertyValue % 2 === 0){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.numericality, Messages.numericalityOddMessage);
      }
    }
    if(validation.numericality.hasOwnProperty('greaterThan') && this._isNumber(validation.numericality.greaterThan)){
      if(propertyValue <= validation.numericality.greaterThan){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.numericality, Ember.String.fmt(Messages.numericalityGreaterThanMessage,validation.numericality.greaterThan));
      }
    }
    if(validation.numericality.hasOwnProperty('greaterThanOrEqualTo') && this._isNumber(validation.numericality.greaterThanOrEqualTo)){
      if(propertyValue < validation.numericality.greaterThanOrEqualTo){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.numericality, Ember.String.fmt(Messages.numericalityGreaterThanOrEqualToMessage,validation.numericality.greaterThanOrEqualTo));
      }
    }
    if(validation.numericality.hasOwnProperty('equalTo') && this._isNumber(validation.numericality.equalTo)){
      if(propertyValue !== validation.numericality.equalTo){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.numericality, Ember.String.fmt(Messages.numericalityEqualToMessage,validation.numericality.equalTo));
      }
    }
    if(validation.numericality.hasOwnProperty('lessThan') && this._isNumber(validation.numericality.lessThan)){
      if(propertyValue >= validation.numericality.lessThan){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.numericality, Ember.String.fmt(Messages.numericalityLessThanMessage,validation.numericality.lessThan));
      }
    }
    if(validation.numericality.hasOwnProperty('lessThanOrEqualTo') && this._isNumber(validation.numericality.lessThanOrEqualTo)){
      if(propertyValue > validation.numericality.lessThanOrEqualTo){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.numericality, Ember.String.fmt(Messages.numericalityLessThanOrEqualToMessage,validation.numericality.lessThanOrEqualTo));
      }
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
  _validateMatch: function(property, validation) {
    let matching = validation.match.attr || validation.match,
        propertyValue = this.get(property),
        matchingValue = this.get(matching);
    if (propertyValue !== matchingValue) {
      this.set('isValidNow',false);
      this._addToErrors(property, validation.match, Ember.String.fmt(Messages.matchMessage,this._unCamelCase(matching)));
    }
  },
  // Length Validator
  _validateLength: function(property, validation) {
    let propertyValue = this.get(property),
        stringLength = !propertyValue ? 0 : String(propertyValue).length,
        validationType = Ember.typeOf(validation.length);
    if(validationType === 'number') {
      validation.length = {is: validation.length};
      this._exactLength(stringLength, property, validation);
    }else if(validationType === 'array'){
      validation.length = {minimum: validation.length[0], maximum: validation.length[1]};
      this._rangeLength(stringLength, property, validation);
    }else if(validationType === 'object'){
      if (validation.length.hasOwnProperty('is')) {
        this._exactLength(stringLength, property, validation);
      }else{
        this._rangeLength(stringLength, property, validation);
      }
    }
  },
  _exactLength:function(stringLength, property, validation) {
    if(stringLength !== validation.length.is){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.length, Ember.String.fmt(Messages.wrongLengthMessage,validation.length.is));
    }
  },
  _rangeLength:function(stringLength, property, validation) {
    let minimum = validation.length.minimum || -1,
        maximum = validation.length.maximum || Infinity;
    if(stringLength < minimum){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.length, Ember.String.fmt(Messages.tooShortMessage,minimum));
    }else if (stringLength > maximum) {
      this.set('isValidNow',false);
      this._addToErrors(property, validation.length, Ember.String.fmt(Messages.tooLongMessage,maximum));
    }
  },
  _validateRelations: function(property, validation) {
    if(validation.relations.indexOf("hasMany") !== -1) {
      if(this.get(property)){
        this.get(property).forEach((objRelation) => {
          if(!objRelation.validate()){
            this.set('isValidNow',false);
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
		let notContainCapital = String(this.get(property)).match(/(?=.*[A-Z])/) === null,
		    message = validation.mustContainCapital.message || Messages.mustContainCapitalMessage;

		if (validation.mustContainCapital && notContainCapital) {
			this.set('isValidNow', false);
      this._addToErrors(property, validation, message);
		}
	},
	_validateMustContainLower: function(property, validation) {
		let containsLower = String(this.get(property)).match(/(?=.*[a-z])/) !== null,
		    message = validation.mustContainLower.message || Messages.mustContainLowerMessage;

		if (validation.mustContainLower && !containsLower) {
			this.set('isValidNow', false);
      this._addToErrors(property, validation, message);
		}
	},
	_validateMustContainNumber: function(property, validation) {
		let containsNumber = String(this.get(property)).match(/(?=.*[0-9])/) !== null,
		    message = validation.mustContainNumber.message || Messages.mustContainNumberMessage;

		if (validation.mustContainNumber && !containsNumber) {
			this.set('isValidNow', false);
			this._addToErrors(property, validation, message);
		}
	},
	_validateMustContainSpecial: function(property, validation) {
		let regexString = validation.mustContainSpecial.acceptableChars || '-+_!@#$%^&*.,?()',
		    regex = new RegExp(`(?=.*[${regexString}])`),
		    containsSpecial = String(this.get(property)).match(regex) !== null,
		    message = validation.mustContainSpecial.message || Messages.mustContainSpecialMessage;

		if (validation.mustContainSpecial && !containsSpecial) {
			this.set('isValidNow', false);
			this._addToErrors(property, validation, Ember.String.fmt(message, regexString));
		}
	},

  /**** Helper methods ****/
  _exceptOrOnly: function(property, options) {
    let validateThis = true;
    if(options.hasOwnProperty('except') && options.except.indexOf(property) !== -1){ validateThis = false; }
    if(options.hasOwnProperty('only') && options.only.indexOf(property) === -1){ validateThis = false; }
    return validateThis;
  },
  _getCustomValidator: function(validation){
    let customValidator = validation;
    if (Ember.typeOf(validation) === 'object' && validation.hasOwnProperty('validation')) {
      customValidator = validation.validation;
    }
    return this._isFunction(customValidator) ? customValidator : false;
  },
  _getCustomMessage: function(validationObj,defaultMessage, property) {
    if (Ember.typeOf(validationObj) === 'object' && validationObj.hasOwnProperty('message')) {
      if( this._isFunction(validationObj.message )){
        let msg = validationObj.message.call(property, this.get(property), this);
        return this._isString( msg ) ? msg : defaultMessage;
      }else{
        return validationObj.message;
      }
    }else{
      return defaultMessage;
    }
  },
  _addToErrors: function(property, validation, defaultMessage) {
    let errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation, defaultMessage, property),
        errorAs =  validation.errorAs || property;
    if (!Ember.isArray(errors[errorAs])) {errors[errorAs] = [];}
    if(this.get('addErrors')){errors[errorAs].push([message]);}
  },
	_isNumber: function (n) {
  	return !isNaN(parseFloat(n)) && isFinite(n);
	},
  _unCamelCase: function (str){
    return str
              // insert a space before all caps
              .replace(/([A-Z])/g, ' $1')
              // uppercase the first character
              .replace(/^./, function(str){ return Ember.String.capitalize(str); });
  },
  _isFunction: function(func) {
    return Ember.isEqual(Ember.typeOf(func),'function');
  },
  _isString: function(str){
    return Ember.isEqual(Ember.typeOf(str), 'string');
  },
  _modelRelations: function() {
    if(this.get('_relationships')){
      return this.get('_relationships');
    }else{
      return this.get('_internalModel._relationships.initializedRelationships');
    }
  }
});
