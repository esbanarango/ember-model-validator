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
  	var errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation.presence, this.presenceMessage);
    if (Ember.isBlank(this.get(property))){
    	if (!Ember.isArray(errors[property])) {errors[property] = [];}
      this.set('isValidNow',false);
    	errors[property].push([message]);
    }
  },
  _validateFormat: function(property, validation) {
    var errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation.format, this.formatMessage),
        withRegexp = validation.format.with;
    if (!this.get(property) || String(this.get(property)).match(withRegexp) === null){
      if (!Ember.isArray(errors[property])) {errors[property] = [];}
      this.set('isValidNow',false);
      errors[property].push([message]);
    }
  },
  _validateEmail: function(property, validation) {
  	var errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation.email, this.mailMessage);
    if (!this.get(property) || String(this.get(property)).match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i) === null){
    	if (!Ember.isArray(errors[property])) {errors[property] = [];}
      this.set('isValidNow',false);
    	errors[property].push([message]);
    }
  },
  _validateColor: function(property, validation) {
    var errors = this.get('validationErrors'),
        propertyValue = this.get(property),
        message = this._getCustomMessage(validation.color, this.colorMessage);
    if (!propertyValue || String(propertyValue).match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i) === null){
      if (!Ember.isArray(errors[property])) {errors[property] = [];}
      this.set('isValidNow',false);
      errors[property].push([message]);
    }
  },
  _validateSubdomain: function(property, validation) {
    var errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation.subdomain, this.subdomainMessage),
        propertyValue = this.get(property),
        reserved = validation.subdomain.reserved || [];
    if (!propertyValue || String(propertyValue).match(/^[a-z\d]+([-_][a-z\d]+)*$/i) === null || reserved.indexOf(propertyValue) !== -1){
      if (!Ember.isArray(errors[property])) {errors[property] = [];}
      this.set('isValidNow',false);
      errors[property].push([message]);
    }
  },
  _validateNumericality: function(property, validation) {
  	var errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation.numericality, this.numericalityMessage);
    if (!this._isNumber(this.get(property))){
    	if (!Ember.isArray(errors[property])) {errors[property] = [];}
      this.set('isValidNow',false);
    	errors[property].push([message]);
    }
  },
  _validateExclusion: function(property, validation) {
    var errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation.exclusion, this.exclusionMessage);
    if(validation.exclusion.hasOwnProperty('in')) {
      if(validation.exclusion.in.indexOf(this.get(property)) !== -1){
        if (!Ember.isArray(errors[property])) {errors[property] = [];}
        this.set('isValidNow',false);
        errors[property].push([message]);
      }
    }
  },
  _validateInclusion: function(property, validation) {
    var errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation.inclusion, this.inclusionMessage);
    if(validation.inclusion.hasOwnProperty('in')) {
      if(validation.inclusion.in.indexOf(this.get(property)) === -1){
        if (!Ember.isArray(errors[property])) {errors[property] = [];}
        this.set('isValidNow',false);
        errors[property].push([message]);
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
	_isNumber: function (n) {
  	return !isNaN(parseFloat(n)) && isFinite(n);
	},
  _isThisAnObject: function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
});
