import Mixin from '@ember/object/mixin';
import { computed, get, set } from '@ember/object';
import { getOwner } from '@ember/application';
import { on } from '@ember/object/evented';
import { capitalize } from '@ember/string';
import { isEmpty, isBlank, isPresent, typeOf, isEqual } from '@ember/utils';
import { A, isArray } from '@ember/array';

import PostalCodesRegex from 'ember-model-validator/postal-codes-regex';

import MessagesEn from '../messages/en';
import MessagesAr from '../messages/ar';
import MessagesFr from '../messages/fr';
import MessagesEs from '../messages/es';
import MessagesPtbr from '../messages/pt-br';

const Messages = {
  en: MessagesEn,
  ar: MessagesAr,
  fr: MessagesFr,
  es: MessagesEs,
  'pt-br': MessagesPtbr
};

export default Mixin.create({
  validationErrors: {},
  isValidNow: true,
  addErrors: true,
  _validationMessages: {},

  _locale: computed(function() {
    return getOwner(this).lookup('validator:locale');
  }),

  _initMessage: on('init', function() {
    let locale = get(this, '_locale') || 'en';
    set(this, '_validationMessages', Messages[locale]);
  }),

  clearErrors() {
    this._internalModel.clearErrorMessages();
  },

  validate(options = {}) {
    let errors = null,
      validations = get(this, 'validations');

    // Clean all the current errors
    this.clearErrors();
    set(this, 'validationErrors', {});
    set(this, 'isValidNow', true);
    errors = get(this, 'validationErrors');

    // Validate but not set errors
    if (options.hasOwnProperty('addErrors')) {
      set(this, 'addErrors', options['addErrors']);
    } else {
      set(this, 'addErrors', true);
    }
    // Call validators defined on each property
    for (let property in validations) {
      for (let validation in validations[property]) {
        if (this._exceptOrOnly(property, options)) {
          let validationName = capitalize(validation);
          // allowBlank option
          if (get(validations[property], `${validation}.allowBlank`) && isEmpty(get(this, property))) {
            continue;
          }
          // conditional functions
          let conditionalFunction = get(validations[property], `${validation}.if`);
          if (conditionalFunction && !conditionalFunction(property, get(this, property), this)) {
            continue;
          }
          this[`_validate${validationName}`](property, validations[property]);
        }
      }
    }

    // Check if it's valid or not
    if (!get(this, 'isValidNow')) {
      // It may be invalid because of its relations
      if (get(this, 'addErrors') && Object.keys(errors).length !== 0) {
        this.pushErrors(errors);
      }
      return false;
    } else {
      return true;
    }
  },

  pushErrors(errors) {
    let store = get(this, 'store');
    let stateToTransition = get(this, 'isNew') ? 'created.uncommitted' : 'updated.uncommitted';
    this.transitionTo(stateToTransition);
    let recordModel = this.adapterDidInvalidate ? this : this._internalModel;
    store.recordWasInvalid(recordModel, errors);
  },

  /**** Validators ****/
  _validateCustom(property, validation) {
    validation = isArray(validation.custom) ? validation.custom : [validation.custom];
    for (let i = 0; i < validation.length; i++) {
      let customValidator = this._getCustomValidator(validation[i]);
      if (customValidator) {
        let passedCustomValidation = customValidator(property, get(this, property), this);
        if (!passedCustomValidation) {
          set(this, 'isValidNow', false);
          this._addToErrors(property, validation[i], get(this, '_validationMessages').customValidationMessage);
        }
      }
    }
  },
  _validatePresence(property, validation) {
    let propertyValue = get(this, property);
    // If the property is an async relationship.
    if (this._modelRelations() && !isBlank(this._modelRelations()[property])) {
      if (this._modelRelations()[property]['isAsync']) {
        propertyValue = get(this, `${property}.content`);
      }
    }
    if (isBlank(propertyValue)) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.presence, get(this, '_validationMessages').presenceMessage);
    }
  },
  _validateAbsence(property, validation) {
    if (isPresent(get(this, property))) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.absence, get(this, '_validationMessages').absenceMessage);
    }
  },
  _validateAcceptance(property, validation) {
    let propertyValue = get(this, property),
      accept = validation.acceptance.accept || [1, '1', true];
    if (!this._includes(A(accept), propertyValue)) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.acceptance, get(this, '_validationMessages').acceptanceMessage);
    }
  },
  _validateFormat(property, validation) {
    let withRegexp = validation.format.with;
    if (get(this, property) && String(get(this, property)).match(withRegexp) === null) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.format, get(this, '_validationMessages').formatMessage);
    }
  },
  _validateEmail(property, validation) {
    if (
      !get(this, property) ||
      String(get(this, property)).match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      ) === null
    ) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.email, get(this, '_validationMessages').mailMessage);
    }
  },
  _validateZipCode(property, validation) {
    const DEFAULT_COUNTRY_CODE = 'US';
    let propertyValue = get(this, property);

    let countryCode = DEFAULT_COUNTRY_CODE;
    if (validation.zipCode.hasOwnProperty('countryCode')) {
      countryCode = validation.zipCode.countryCode;
    }
    if (isArray(countryCode)) {
      countryCode.forEach(function(code) {
        let postalCodeRegexp = PostalCodesRegex[code];
        if (typeof postalCodeRegexp === 'undefined') {
          postalCodeRegexp = PostalCodesRegex[DEFAULT_COUNTRY_CODE];
        }
        if (!propertyValue || String(propertyValue).match(postalCodeRegexp) === null) {
          set(this, 'isValidNow', false);
          this._addToErrors(property, validation.zipCode, get(this, '_validationMessages').zipCodeMessage);
        }
      });
    } else {
      let postalCodeRegexp = PostalCodesRegex[countryCode];
      if (typeof postalCodeRegexp === 'undefined') {
        postalCodeRegexp = PostalCodesRegex[DEFAULT_COUNTRY_CODE];
      }
      if (!propertyValue || String(propertyValue).match(postalCodeRegexp) === null) {
        set(this, 'isValidNow', false);
        this._addToErrors(property, validation.zipCode, get(this, '_validationMessages').zipCodeMessage);
      }
    }
  },
  _validateColor(property, validation) {
    let propertyValue = get(this, property);
    if (!propertyValue || String(propertyValue).match(/([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i) === null) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.color, get(this, '_validationMessages').colorMessage);
    }
  },
  _validateURL(property, validation) {
    let propertyValue = get(this, property);
    if (
      !propertyValue ||
      String(propertyValue).match(
        /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/
      ) === null
    ) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.URL, get(this, '_validationMessages').URLMessage);
    }
  },
  _validateSubdomain(property, validation) {
    let propertyValue = get(this, property),
      reserved = validation.subdomain.reserved || [];
    if (
      !propertyValue ||
      String(propertyValue).match(/^[a-z\d]+([-_][a-z\d]+)*$/i) === null ||
      reserved.indexOf(propertyValue) !== -1
    ) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.subdomain, get(this, '_validationMessages').subdomainMessage);
    }
  },
  _validateDate(property, validation) {
    let propertyValue = new Date(get(this, property));
    if (isNaN(propertyValue.getTime())) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.date, get(this, '_validationMessages').dateMessage);
      return;
    }
    if (validation.date.hasOwnProperty('before') && validation.date.before) {
      if (propertyValue.getTime() >= new Date(validation.date.before).getTime()) {
        set(this, 'isValidNow', false);
        let context = { date: new Date(validation.date.before) };
        validation.date.interpolatedValue = validation.date.before;
        this._addToErrors(
          property,
          validation.date,
          this._formatMessage(get(this, '_validationMessages').dateBeforeMessage, context)
        );
      }
    }
    if (validation.date.hasOwnProperty('after') && validation.date.after) {
      if (propertyValue.getTime() <= new Date(validation.date.after).getTime()) {
        set(this, 'isValidNow', false);
        let context = { date: new Date(validation.date.after) };
        validation.date.interpolatedValue = validation.date.after;
        this._addToErrors(
          property,
          validation.date,
          this._formatMessage(get(this, '_validationMessages').dateAfterMessage, context)
        );
      }
    }
  },
  _validateNumericality(property, validation) {
    let propertyValue = get(this, property);
    if (!this._isNumber(get(this, property))) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation.numericality, get(this, '_validationMessages').numericalityMessage);
    }
    if (validation.numericality.hasOwnProperty('onlyInteger') && validation.numericality.onlyInteger) {
      if (!/^[+-]?\d+$/.test(propertyValue)) {
        set(this, 'isValidNow', false);
        this._addToErrors(property, validation.numericality, get(this, '_validationMessages').numericalityOnlyIntegerMessage);
      }
    }
    if (validation.numericality.hasOwnProperty('even') && validation.numericality.even) {
      if (propertyValue % 2 !== 0) {
        set(this, 'isValidNow', false);
        this._addToErrors(property, validation.numericality, get(this, '_validationMessages').numericalityEvenMessage);
      }
    }
    if (validation.numericality.hasOwnProperty('odd') && validation.numericality.odd) {
      if (propertyValue % 2 === 0) {
        set(this, 'isValidNow', false);
        this._addToErrors(property, validation.numericality, get(this, '_validationMessages').numericalityOddMessage);
      }
    }
    if (validation.numericality.hasOwnProperty('greaterThan') && this._isNumber(validation.numericality.greaterThan)) {
      if (propertyValue <= validation.numericality.greaterThan) {
        set(this, 'isValidNow', false);
        let context = { count: validation.numericality.greaterThan };
        validation.numericality.interpolatedValue = validation.numericality.greaterThan;
        this._addToErrors(
          property,
          validation.numericality,
          this._formatMessage(get(this, '_validationMessages').numericalityGreaterThanMessage, context)
        );
      }
    }
    if (
      validation.numericality.hasOwnProperty('greaterThanOrEqualTo') &&
      this._isNumber(validation.numericality.greaterThanOrEqualTo)
    ) {
      if (propertyValue < validation.numericality.greaterThanOrEqualTo) {
        set(this, 'isValidNow', false);
        let context = { count: validation.numericality.greaterThanOrEqualTo };
        validation.numericality.interpolatedValue = validation.numericality.greaterThanOrEqualTo;
        this._addToErrors(
          property,
          validation.numericality,
          this._formatMessage(get(this, '_validationMessages').numericalityGreaterThanOrEqualToMessage, context)
        );
      }
    }
    if (validation.numericality.hasOwnProperty('equalTo') && this._isNumber(validation.numericality.equalTo)) {
      if (propertyValue !== validation.numericality.equalTo) {
        set(this, 'isValidNow', false);
        let context = { count: validation.numericality.equalTo };
        validation.numericality.interpolatedValue = validation.numericality.equalTo;
        this._addToErrors(
          property,
          validation.numericality,
          this._formatMessage(get(this, '_validationMessages').numericalityEqualToMessage, context)
        );
      }
    }
    if (validation.numericality.hasOwnProperty('lessThan') && this._isNumber(validation.numericality.lessThan)) {
      if (propertyValue >= validation.numericality.lessThan) {
        set(this, 'isValidNow', false);
        let context = { count: validation.numericality.lessThan };
        validation.numericality.interpolatedValue = validation.numericality.lessThan;
        this._addToErrors(
          property,
          validation.numericality,
          this._formatMessage(get(this, '_validationMessages').numericalityLessThanMessage, context)
        );
      }
    }
    if (
      validation.numericality.hasOwnProperty('lessThanOrEqualTo') &&
      this._isNumber(validation.numericality.lessThanOrEqualTo)
    ) {
      if (propertyValue > validation.numericality.lessThanOrEqualTo) {
        set(this, 'isValidNow', false);
        let context = { count: validation.numericality.lessThanOrEqualTo };
        validation.numericality.interpolatedValue = validation.numericality.lessThanOrEqualTo;
        this._addToErrors(
          property,
          validation.numericality,
          this._formatMessage(get(this, '_validationMessages').numericalityLessThanOrEqualToMessage, context)
        );
      }
    }
  },
  _validateExclusion(property, validation) {
    if (validation.exclusion.hasOwnProperty('in')) {
      if (validation.exclusion.in.indexOf(get(this, property)) !== -1) {
        set(this, 'isValidNow', false);
        this._addToErrors(property, validation.exclusion, get(this, '_validationMessages').exclusionMessage);
      }
    }
  },
  _validateInclusion(property, validation) {
    if (validation.inclusion.hasOwnProperty('in')) {
      if (validation.inclusion.in.indexOf(get(this, property)) === -1) {
        set(this, 'isValidNow', false);
        this._addToErrors(property, validation.inclusion, get(this, '_validationMessages').inclusionMessage);
      }
    }
  },
  _validateMatch(property, validation) {
    let matching = validation.match.attr || validation.match,
      propertyValue = get(this, property),
      matchingValue = get(this, matching);
    if (propertyValue !== matchingValue) {
      set(this, 'isValidNow', false);
      let matchingUnCamelCase = this._unCamelCase(matching);
      let context = { match: matchingUnCamelCase };
      if (typeOf(validation.match) === 'object') {
        validation.match.interpolatedValue = matchingUnCamelCase;
      }
      this._addToErrors(property, validation.match, this._formatMessage(get(this, '_validationMessages').matchMessage, context));
    }
  },
  // Length Validator
  _validateLength(property, validation) {
    let propertyValue = get(this, property),
      stringLength = !propertyValue ? 0 : String(propertyValue).length,
      validationType = typeOf(validation.length);
    if (validationType === 'number') {
      validation.length = { is: validation.length };
      this._exactLength(stringLength, property, validation);
    } else if (validationType === 'array') {
      validation.length = { minimum: validation.length[0], maximum: validation.length[1] };
      this._rangeLength(stringLength, property, validation);
    } else if (validationType === 'object') {
      if (validation.length.hasOwnProperty('is')) {
        this._exactLength(stringLength, property, validation);
      } else {
        this._rangeLength(stringLength, property, validation);
      }
    }
  },
  _exactLength(stringLength, property, validation) {
    if (stringLength !== validation.length.is) {
      set(this, 'isValidNow', false);
      let context = { count: validation.length.is };
      validation.length.interpolatedValue = validation.length.is;
      this._addToErrors(
        property,
        validation.length,
        this._formatMessage(get(this, '_validationMessages').wrongLengthMessage, context)
      );
    }
  },
  _rangeLength(stringLength, property, validation) {
    let minimum = -1,
      maximum = Infinity;
    // Maximum and Minimum can be objects
    if (typeOf(validation.length.minimum) === 'number') {
      minimum = validation.length.minimum;
    } else if (typeOf(validation.length.minimum) === 'object' && validation.length.minimum.hasOwnProperty('value')) {
      minimum = validation.length.minimum.value;
    }
    if (typeOf(validation.length.maximum) === 'number') {
      maximum = validation.length.maximum;
    } else if (typeOf(validation.length.maximum) === 'object' && validation.length.maximum.hasOwnProperty('value')) {
      maximum = validation.length.maximum.value;
    }

    if (stringLength < minimum) {
      set(this, 'isValidNow', false);
      let context = { count: minimum };
      if (typeOf(validation.length.minimum) === 'object') {
        validation.length.minimum.interpolatedValue = minimum;
      }
      this._addToErrors(
        property,
        validation.length.minimum,
        this._formatMessage(get(this, '_validationMessages').tooShortMessage, context)
      );
    } else if (stringLength > maximum) {
      set(this, 'isValidNow', false);
      let context = { count: maximum };
      if (typeOf(validation.length.maximum) === 'object') {
        validation.length.maximum.interpolatedValue = maximum;
      }
      this._addToErrors(
        property,
        validation.length.maximum,
        this._formatMessage(get(this, '_validationMessages').tooLongMessage, context)
      );
    }
  },
  _validateRelations(property, validation) {
    if (validation.relations.indexOf('hasMany') !== -1) {
      if (get(this, `${property}.content`)) {
        get(this, `${property}.content`).forEach(objRelation => {
          if (!objRelation.validate()) {
            set(this, 'isValidNow', false);
          }
        });
      }
    } else if (validation.relations.indexOf('belongsTo') !== -1) {
      if (get(this, `${property}.content`) && !get(this, `${property}.content`).validate()) {
        set(this, 'isValidNow', false);
      }
    }
  },
  _validateMustContainCapital(property, validation) {
    let notContainCapital = String(get(this, property)).match(/(?=.*[A-Z])/) === null,
      message = validation.mustContainCapital.message || get(this, '_validationMessages').mustContainCapitalMessage;
    if (validation.mustContainCapital && notContainCapital) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation, message);
    }
  },
  _validateMustContainLower(property, validation) {
    let containsLower = String(get(this, property)).match(/(?=.*[a-z])/) !== null,
      message = validation.mustContainLower.message || get(this, '_validationMessages').mustContainLowerMessage;
    if (validation.mustContainLower && !containsLower) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation, message);
    }
  },
  _validateMustContainNumber(property, validation) {
    let containsNumber = String(get(this, property)).match(/(?=.*[0-9])/) !== null,
      message = validation.mustContainNumber.message || get(this, '_validationMessages').mustContainNumberMessage;
    if (validation.mustContainNumber && !containsNumber) {
      set(this, 'isValidNow', false);
      this._addToErrors(property, validation, message);
    }
  },
  _validateMustContainSpecial(property, validation) {
    let regexString = validation.mustContainSpecial.acceptableChars || '-+_!@#$%^&*.,?()',
      regex = new RegExp(`(?=.*[${regexString}])`),
      containsSpecial = String(get(this, property)).match(regex) !== null,
      message = validation.mustContainSpecial.message || get(this, '_validationMessages').mustContainSpecialMessage;
    if (validation.mustContainSpecial && !containsSpecial) {
      set(this, 'isValidNow', false);
      let context = { characters: regexString };
      this._addToErrors(property, validation, this._formatMessage(message, context));
    }
  },

  /**** Helper methods ****/
  _exceptOrOnly(property, options) {
    let validateThis = true;
    if (options.hasOwnProperty('except') && options.except.indexOf(property) !== -1) {
      validateThis = false;
    }
    if (options.hasOwnProperty('only') && options.only.indexOf(property) === -1) {
      validateThis = false;
    }
    return validateThis;
  },
  _getCustomValidator(validation) {
    let customValidator = validation;
    if (typeOf(validation) === 'object' && validation.hasOwnProperty('validation')) {
      customValidator = validation.validation;
    }
    return this._isFunction(customValidator) ? customValidator : false;
  },
  _getCustomMessage(validationObj, defaultMessage, property) {
    if (typeOf(validationObj) === 'object' && validationObj.hasOwnProperty('message')) {
      if (this._isFunction(validationObj.message)) {
        let msg = validationObj.message.call(this, property, get(this, property), this);
        return this._isString(msg) ? msg : defaultMessage;
      } else {
        let context = { value: validationObj.interpolatedValue };
        return this._formatMessage(validationObj.message, context);
      }
    } else {
      return defaultMessage;
    }
  },
  _addToErrors(property, validation, defaultMessage) {
    let errors = get(this, 'validationErrors'),
      message = this._getCustomMessage(validation, defaultMessage, property),
      errorAs = typeOf(validation) === 'object' ? validation.errorAs || property : property;
    if (!isArray(errors[errorAs])) {
      errors[errorAs] = [];
    }
    if (get(this, 'addErrors')) {
      errors[errorAs].push([message]);
    }
  },

  // Specific funcs
  _isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  _unCamelCase(str) {
    return (
      str
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str) {
          return capitalize(str);
        })
    );
  },
  _isFunction(func) {
    return isEqual(typeOf(func), 'function');
  },
  _isString(str) {
    return isEqual(typeOf(str), 'string');
  },
  _includes(enums, value) {
    if (enums.includes) {
      return enums.includes(value);
    } else {
      // Support old ember versions
      return enums.contains(value);
    }
  },
  _modelRelations() {
    if (get(this, '_relationships')) {
      return get(this, '_relationships');
    } else if (get(this, '_internalModel._relationships')) {
      return get(this, '_internalModel._relationships.initializedRelationships');
    } else {
      return get(this, '_internalModel._recordData._relationships.initializedRelationships');
    }
  },
  _formatMessage(message, context = {}) {
    return message.replace(/\{(\w+)\}/, (s, attr) => context[attr]);
  }
});
