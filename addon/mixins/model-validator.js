import Ember from 'ember';

export default Ember.Mixin.create({
  // Default messages
  presenceMessage: 'can\`t be blank',
  inclusionMessage: 'is not included in the list',
  exclusionMessage: 'is reserved',
  numericalityMessage: 'is not a number',
  mailMessage: 'is not a valid email',
  formatMessage: 'is invalid',
  colorMessage: 'must be a valid CSS hex color code',
  subdomainMessage: 'must be a valid CSS hex color code',

	validationErrors: {},
  isValidNow: true,

  validate: function() {
    var store = this.get('store'),
    		errors = null,
    		validations = this.get('validations');

  	// Clean all the current errors
    this.get('errors').clear();
    this.set('validationErrors',{});
    this.set('isValidNow',true);
    errors = this.get('validationErrors');

    // Call validators defined on each property
		for (var property in validations) {
			for (var validation in validations[property]) {
				var validationName = (validation.charAt(0).toUpperCase() + validation.slice(1));
				this[`_validate${validationName}`](property, validations[property]);
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
      this._addToErrors(property, validation.presence, this.presenceMessage);
    }
  },
  _validateFormat: function(property, validation) {
    var withRegexp = validation.format.with;
    if (!this.get(property) || String(this.get(property)).match(withRegexp) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.format, this.formatMessage);
    }
  },
  _validateEmail: function(property, validation) {
    if (!this.get(property) || String(this.get(property)).match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.email, this.mailMessage);
    }
  },
  _validateColor: function(property, validation) {
    var propertyValue = this.get(property);
    if (!propertyValue || String(propertyValue).match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.color, this.colorMessage);
    }
  },
  _validateSubdomain: function(property, validation) {
    var propertyValue = this.get(property),
        reserved = validation.subdomain.reserved || [];
    if (!propertyValue || String(propertyValue).match(/^[a-z\d]+([-_][a-z\d]+)*$/i) === null || reserved.indexOf(propertyValue) !== -1){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.subdomain, this.subdomainMessage);
    }
  },
  _validateNumericality: function(property, validation) {
    if (!this._isNumber(this.get(property))){
      this.set('isValidNow',false);
    	this._addToErrors(property, validation.numericality, this.numericalityMessage);
    }
  },
  _validateExclusion: function(property, validation) {
    if(validation.exclusion.hasOwnProperty('in')) {
      if(validation.exclusion.in.indexOf(this.get(property)) !== -1){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.exclusion, this.exclusionMessage);
      }
    }
  },
  _validateInclusion: function(property, validation) {
    if(validation.inclusion.hasOwnProperty('in')) {
      if(validation.inclusion.in.indexOf(this.get(property)) === -1){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.inclusion, this.inclusionMessage);
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
    }
  },

  /**** Helpder methods ****/
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
