import Ember from 'ember';

export default Ember.Mixin.create({
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

		for (var property in validations) {
			for (var validation in validations[property]) {
				var validationName = (validation.charAt(0).toUpperCase() + validation.slice(1));
				this[`_validate${validationName}`](property, validations[property]);
			}
		}

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
  _validatePresence: function(property, validation) {
  	var  _this = this,
  				errors = this.get('validationErrors'),
  				validations = this.get('validations');

    if (Ember.isBlank(_this.get(property))){
    	if (!Ember.isArray(errors[property])) {errors[property] = [];}
      _this.set('isValidNow',false);
    	errors[property].push(['This field is required']);
    }
  },
  _validateEmail: function(property, validation) {
  	var  _this = this,
  				errors = this.get('validationErrors'),
  				validations = this.get('validations');
    if (_this.get(property) && _this.get(property).match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i) === null){
    	if (!Ember.isArray(errors[property])) {errors[property] = [];}
      _this.set('isValidNow',false);
    	errors[property].push(['Enter a valid email address']);
    }
  },
  _validateRelations: function(property, validation) {
    var  _this = this,
          validations = this.get('validations');
    if(validation.relations.indexOf("hasMany") !== -1) {
      if(_this.get(property)){
        _this.get(property).forEach(function(objRelation) {
          if(!objRelation.validate()){
            _this.set('isValidNow',false);
          }
        });
      }
    }
  }

});
