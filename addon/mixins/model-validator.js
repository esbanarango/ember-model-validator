import Ember from 'ember';
import Messages from 'ember-model-validator/messages/en';
import PostalCodesRegex from 'ember-model-validator/postal-codes-regex';

export default Ember.Mixin.create({
  validationErrors: {},
  isValidNow: true,
  addErrors: true,
  clearErrors() {
    this._internalModel.clearErrorMessages();
  },
  validate(options={}) {
    let store = this.get('store'),
        errors = null,
        validations = this.get('validations');

    // Clean all the current errors
    this.clearErrors();
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
  _validateCustom(property, validation) {
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
  _validatePresence(property, validation) {
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
  _validateAbsence(property, validation) {
    if (Ember.isPresent(this.get(property))){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.absence, Messages.absenceMessage);
    }
  },
  _validateAcceptance(property, validation) {
    let propertyValue = this.get(property),
        accept =  validation.acceptance.accept || [1,'1', true];
    if(!Ember.A(accept).contains(propertyValue)){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.acceptance, Messages.acceptanceMessage);
    }
  },
  _validateFormat(property, validation) {
    let withRegexp = validation.format.with;
    if (!this.get(property) || String(this.get(property)).match(withRegexp) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.format, Messages.formatMessage);
    }
  },
  _validateEmail(property, validation) {
    if (!this.get(property) || String(this.get(property)).match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.email, Messages.mailMessage);
    }
  },
  _validateZipCode(property, validation) {
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
  _validateColor(property, validation) {
    let propertyValue = this.get(property);
    if (!propertyValue || String(propertyValue).match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.color, Messages.colorMessage);
    }
  },
  _validateURL(property, validation) {
    let propertyValue = this.get(property);
    if (!propertyValue || String(propertyValue).match(/^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/) === null){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.URL, Messages.URLMessage);
    }
  },
  _validateSubdomain(property, validation) {
    let propertyValue = this.get(property),
        reserved = validation.subdomain.reserved || [];
    if (!propertyValue || String(propertyValue).match(/^[a-z\d]+([-_][a-z\d]+)*$/i) === null || reserved.indexOf(propertyValue) !== -1){
      this.set('isValidNow',false);
      this._addToErrors(property, validation.subdomain, Messages.subdomainMessage);
    }
  },
  _validateDate(property, validation) {
    let propertyValue = new Date(this.get(property));
    if (isNaN(propertyValue.getTime())) {
      this.set('isValidNow', false);
      this._addToErrors(property, validation.date, Messages.dateMessage);
      return;
    }
    if (validation.date.hasOwnProperty('before') && validation.date.before) {
      if (propertyValue.getTime() >= new Date(validation.date.before).getTime()) {
        this.set('isValidNow', false);
        let context = {date: new Date(validation.date.before)};
        this._addToErrors(property, validation.date, this._formatMessage(Messages.dateBeforeMessage, context));
      }
    }
    if (validation.date.hasOwnProperty('after') && validation.date.after) {
      if (propertyValue.getTime() <= new Date(validation.date.after).getTime()) {
        this.set('isValidNow', false);
        let context = {date: new Date(validation.date.after)};
        this._addToErrors(property, validation.date, this._formatMessage(Messages.dateAfterMessage, context));
      }
    }
  },
  _validateNumericality(property, validation) {
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
        let context = {count: validation.numericality.greaterThan};
        this._addToErrors(property, validation.numericality, this._formatMessage(Messages.numericalityGreaterThanMessage, context));
      }
    }
    if(validation.numericality.hasOwnProperty('greaterThanOrEqualTo') && this._isNumber(validation.numericality.greaterThanOrEqualTo)){
      if(propertyValue < validation.numericality.greaterThanOrEqualTo){
        this.set('isValidNow',false);
        let context = {count: validation.numericality.greaterThanOrEqualTo};
        this._addToErrors(property, validation.numericality, this._formatMessage(Messages.numericalityGreaterThanOrEqualToMessage, context));
      }
    }
    if(validation.numericality.hasOwnProperty('equalTo') && this._isNumber(validation.numericality.equalTo)){
      if(propertyValue !== validation.numericality.equalTo){
        this.set('isValidNow',false);
        let context = {count: validation.numericality.equalTo};
        this._addToErrors(property, validation.numericality, this._formatMessage(Messages.numericalityEqualToMessage, context));
      }
    }
    if(validation.numericality.hasOwnProperty('lessThan') && this._isNumber(validation.numericality.lessThan)){
      if(propertyValue >= validation.numericality.lessThan){
        this.set('isValidNow',false);
        let context = {count: validation.numericality.lessThan};
        this._addToErrors(property, validation.numericality, this._formatMessage(Messages.numericalityLessThanMessage, context));
      }
    }
    if(validation.numericality.hasOwnProperty('lessThanOrEqualTo') && this._isNumber(validation.numericality.lessThanOrEqualTo)){
      if(propertyValue > validation.numericality.lessThanOrEqualTo){
        this.set('isValidNow',false);
        let context = {count: validation.numericality.lessThanOrEqualTo};
        this._addToErrors(property, validation.numericality, this._formatMessage(Messages.numericalityLessThanOrEqualToMessage, context));
      }
    }
  },
  _validateExclusion(property, validation) {
    if(validation.exclusion.hasOwnProperty('in')) {
      if(validation.exclusion.in.indexOf(this.get(property)) !== -1){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.exclusion, Messages.exclusionMessage);
      }
    }
  },
  _validateInclusion(property, validation) {
    if(validation.inclusion.hasOwnProperty('in')) {
      if(validation.inclusion.in.indexOf(this.get(property)) === -1){
        this.set('isValidNow',false);
        this._addToErrors(property, validation.inclusion, Messages.inclusionMessage);
      }
    }
  },
  _validateMatch(property, validation) {
    let matching = validation.match.attr || validation.match,
        propertyValue = this.get(property),
        matchingValue = this.get(matching);
    if (propertyValue !== matchingValue) {
      this.set('isValidNow',false);
      let context = {match: this._unCamelCase(matching)};
      this._addToErrors(property, validation.match, this._formatMessage(Messages.matchMessage, context));
    }
  },
  // Length Validator
  _validateLength(property, validation) {
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
  _exactLength(stringLength, property, validation) {
    if(stringLength !== validation.length.is){
      this.set('isValidNow',false);
      let context = {count: validation.length.is};
      this._addToErrors(property, validation.length, this._formatMessage(Messages.wrongLengthMessage, context));
    }
  },
  _rangeLength(stringLength, property, validation) {
    let minimum = -1,
        maximum = Infinity;
    // Maximum and Minimum can be objects
    if(Ember.typeOf(validation.length.minimum) === 'number'){
      minimum = validation.length.minimum;
    }else if(Ember.typeOf(validation.length.minimum) === 'object' && validation.length.minimum.hasOwnProperty('value')){
      minimum = validation.length.minimum.value;
    }
    if(Ember.typeOf(validation.length.maximum) === 'number'){
      maximum = validation.length.maximum;
    }else if(Ember.typeOf(validation.length.maximum) === 'object' && validation.length.maximum.hasOwnProperty('value')){
      maximum = validation.length.maximum.value;
    }

    if(stringLength < minimum){
      this.set('isValidNow',false);
      let context = {count: minimum};
      this._addToErrors(property, validation.length.minimum, this._formatMessage(Messages.tooShortMessage, context));
    }else if (stringLength > maximum) {
      this.set('isValidNow',false);
      let context = {count: maximum};
      this._addToErrors(property, validation.length.maximum, this._formatMessage(Messages.tooLongMessage, context));
    }
  },
  _validateRelations(property, validation) {
    if(validation.relations.indexOf("hasMany") !== -1) {
      if(this.get(`${property}.content`)){
        this.get(`${property}.content`).forEach((objRelation) => {
          if(!objRelation.validate()){
            this.set('isValidNow',false);
          }
        });
      }
    }else if(validation.relations.indexOf("belongsTo") !== -1){
      if(this.get(`${property}.content`) && !this.get(`${property}.content`).validate()){
        this.set('isValidNow',false);
      }
    }
  },
  _validateMustContainCapital(property, validation) {
    let notContainCapital = String(this.get(property)).match(/(?=.*[A-Z])/) === null,
        message = validation.mustContainCapital.message || Messages.mustContainCapitalMessage;
    if (validation.mustContainCapital && notContainCapital) {
      this.set('isValidNow', false);
      this._addToErrors(property, validation, message);
    }
  },
  _validateMustContainLower(property, validation) {
    let containsLower = String(this.get(property)).match(/(?=.*[a-z])/) !== null,
        message = validation.mustContainLower.message || Messages.mustContainLowerMessage;
    if (validation.mustContainLower && !containsLower) {
      this.set('isValidNow', false);
      this._addToErrors(property, validation, message);
    }
  },
  _validateMustContainNumber(property, validation) {
    let containsNumber = String(this.get(property)).match(/(?=.*[0-9])/) !== null,
        message = validation.mustContainNumber.message || Messages.mustContainNumberMessage;
    if (validation.mustContainNumber && !containsNumber) {
      this.set('isValidNow', false);
      this._addToErrors(property, validation, message);
    }
  },
  _validateMustContainSpecial(property, validation) {
    let regexString = validation.mustContainSpecial.acceptableChars || '-+_!@#$%^&*.,?()',
        regex = new RegExp(`(?=.*[${regexString}])`),
        containsSpecial = String(this.get(property)).match(regex) !== null,
        message = validation.mustContainSpecial.message || Messages.mustContainSpecialMessage;
    if (validation.mustContainSpecial && !containsSpecial) {
      this.set('isValidNow', false);
      let context = {characters: regexString};
      this._addToErrors(property, validation, this._formatMessage(message, context));
    }
  },

  /**** Helper methods ****/
  _exceptOrOnly(property, options) {
    let validateThis = true;
    if(options.hasOwnProperty('except') && options.except.indexOf(property) !== -1){ validateThis = false; }
    if(options.hasOwnProperty('only') && options.only.indexOf(property) === -1){ validateThis = false; }
    return validateThis;
  },
  _getCustomValidator(validation) {
    let customValidator = validation;
    if (Ember.typeOf(validation) === 'object' && validation.hasOwnProperty('validation')) {
      customValidator = validation.validation;
    }
    return this._isFunction(customValidator) ? customValidator : false;
  },
  _getCustomMessage(validationObj, defaultMessage, property) {
    if (Ember.typeOf(validationObj) === 'object' && validationObj.hasOwnProperty('message')) {
      if(this._isFunction(validationObj.message)){
        let msg = validationObj.message.call(property, this.get(property), this);
        return this._isString( msg ) ? msg : defaultMessage;
      }else{
        return validationObj.message;
      }
    }else{
      return defaultMessage;
    }
  },
  _addToErrors(property, validation, defaultMessage) {
    let errors = this.get('validationErrors'),
        message = this._getCustomMessage(validation, defaultMessage, property),
        errorAs = Ember.typeOf(validation) === 'object' ? (validation.errorAs || property) : property;
    if (!Ember.isArray(errors[errorAs])) {errors[errorAs] = [];}
    if(this.get('addErrors')){errors[errorAs].push([message]);}
  },
  _isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  _unCamelCase(str) {
    return str
    // insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return Ember.String.capitalize(str); });
  },
  _isFunction(func) {
    return Ember.isEqual(Ember.typeOf(func),'function');
  },
  _isString(str) {
    return Ember.isEqual(Ember.typeOf(str), 'string');
  },
  _modelRelations() {
    if(this.get('_relationships')){
      return this.get('_relationships');
    }else{
      return this.get('_internalModel._relationships.initializedRelationships');
    }
  },
  _formatMessage(message, context = {}){
    let regex = new RegExp(`/\{(\w+)\}/g`);
    return message.replace(regex, (s, attr) => context[attr]);
  }
});
