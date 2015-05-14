import Ember from 'ember';

export default Ember.Mixin.create({
	validationErrors: {},
  isValidNow: true,
  validate: function() {
    var store = this.get('store'),
    		errors = null;

  	// Clean all the current errors
    this.get('errors').clear();
    this.set('validationErrors',{});
    this.set('isValidNow',true);
    errors = this.get('validationErrors');

    // Check for presence:
    this._validatePresence();
    // Check for valid emails:
    this._validateEmail();
    // Check relations:
    this._validateRelations();
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
  _validatePresence: function() {
  	var  _this = this,
  				errors = this.get('validationErrors'),
  				validations = this.get('validations');
    if(validations && validations.hasOwnProperty('presence')) {
      validations.presence.forEach(function(property) {
        if (Ember.isBlank(_this.get(property))){
        	if (!Ember.isArray(errors[property])) {errors[property] = [];}
          _this.set('isValidNow',false);
        	errors[property].push(['This field is required']);
        }
      });
    }
  },
  _validateEmail: function() {
  	var  _this = this,
  				errors = this.get('validationErrors'),
  				validations = this.get('validations');
    if(validations && validations.hasOwnProperty('email')) {
      validations.email.forEach(function(property) {
        if (_this.get(property) && _this.get(property).match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i) === null){
        	if (!Ember.isArray(errors[property])) {errors[property] = [];}
          _this.set('isValidNow',false);
        	errors[property].push(['Enter a valid email address']);
        }
      });
    }
  },
  _validateRelations: function() {
    var  _this = this,
          validations = this.get('validations');
    if(validations && validations.hasOwnProperty("relations")) {
      if(validations.relations.hasOwnProperty("hasMany")) {
        validations.relations.hasMany.forEach(function(relation) {
          if(_this.get(relation)){
            _this.get(relation).forEach(function(objRelation) {
              if(!objRelation.validate()){
                _this.set('isValidNow',false);
              }
            });
          }
        });
      }
    }
  }

});
