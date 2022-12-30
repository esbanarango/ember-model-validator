import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class FakeModel extends Model {
  @attr('string') name;
  @attr('string') login;
  @attr('string') secondName;
  @attr('string') email;
  @attr('string') password;
  @attr('string') passwordConfirmation;
  @attr('string', { defaultValue: 'donJoseRene@higuita.com' }) bussinessEmail;
  @attr('string', { defaultValue: '423abb' }) favoriteColor;
  @attr('string') legacyCode;
  @attr('string', { defaultValue: 'hiphopBachatudo' }) mainstreamCode;
  @attr('number') lotteryNumber;
  @attr('number') alibabaNumber;
  @attr('number', { defaultValue: 111 }) anInteger;
  @attr('number', { defaultValue: 5 }) anIntegerGreaterThan4;
  @attr('number', { defaultValue: 3 }) anIntegerLessThan4;
  @attr('number', { defaultValue: 7 }) anIntegerGreaterThanOrEqual7;
  @attr('number', { defaultValue: 6 }) anIntegerLessThanOrEqual6;
  @attr('number', { defaultValue: 10 }) aTenNumber;
  @attr('number', { defaultValue: 3 }) anOddNumber;
  @attr('number', { defaultValue: 2 }) anEvenNumber;
  @attr('number', { defaultValue: null }) anOptionalNumber;
  @attr('boolean', { defaultValue: true }) acceptConditions;
  @attr('number', { defaultValue: 12345 }) socialSecurity;
  @attr('number', { defaultValue: 1234 }) nsaNumber;
  @attr('number', { defaultValue: 1234567891 }) chuncaluchoNumber;
  @attr('number', { defaultValue: 3223 }) theMinimunmTwoNumber;
  @attr('number', { defaultValue: 3223222222 }) theMinimunmInterpolatedTenNumber;
  @attr('string', { defaultValue: 12345 }) hugeName;
  @attr('string', { defaultValue: '09011' }) postalCodeUS;
  @attr('string', { defaultValue: 'KY16 8BP' }) postalCodeUK;
  @attr('string', { defaultValue: 'T2A2V8' }) postalCodeCA;
  @attr('string', { defaultValue: '09011' }) postalCodeZZ;
  @attr('string', { defaultValue: 'fake_subdomain' }) mySubdomain;
  @attr('string', { defaultValue: 'http://esbanarango.com' }) myBlog;
  @attr('') thing;
  @attr('number', { defaultValue: 12345 }) otherCustomValidation;
  @attr('number', { defaultValue: 12345 }) otherCustomValidationBadMessageFunction;
  @attr('') images;
  @attr('string') condType;

  @hasMany('other-model') otherFakes;
  @belongsTo('other-model') otherFake;
  @belongsTo('async-model', { async: true }) asyncModel;

  @attr('date', {
    defaultValue() {
      return new Date();
    },
  })
  date;

  @attr('string', { defaultValue: '2015-01-01' }) stringDate;
  @attr('date', {
    defaultValue() {
      return new Date(2014, 7, 1);
    },
  })
  dateBefore2015;

  @attr('date', {
    defaultValue() {
      return new Date(2015, 5, 3);
    },
  })
  dateAfter2014;

  validations = {
    asyncModel: {
      presence: true,
    },
    name: {
      presence: { errorAs: 'profile.name' },
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'], message: 'Solo verde a morir' },
    },
    images: {
      presence: {
        if: function (key, value, _this) {
          return 'gallery' === _this.get('condType');
        },
      },
    },
    login: {
      absence: true,
    },
    secondName: {
      exclusion: { in: ['Gionvany Hernandez', 'Wilder Medina'], message: 'Que iNrresponsabilidad' },
    },
    socialSecurity: {
      length: 5,
    },
    nsaNumber: {
      length: [3, 5],
    },
    chuncaluchoNumber: {
      length: { is: 10, message: 'this is not the length of a chuncalucho' },
    },
    theMinimunmTwoNumber: {
      length: {
        minimum: {
          value: 2,
          message: 'please it has to be minimum 2 come on man!!',
        },
      },
    },
    theMinimunmInterpolatedTenNumber: {
      length: {
        minimum: {
          value: 10,
          message: 'eeeche {value}',
        },
      },
    },
    hugeName: {
      length: {
        minimum: 3,
        maximum: 5,
      },
    },
    bussinessEmail: {
      presence: { message: "sup dude, where's da email" },
      email: { message: 'Be professional ma men' },
    },
    favoriteColor: {
      color: { message: 'not a hex color' },
    },
    email: {
      presence: true,
      email: true,
    },
    password: {
      custom: function (key, value, _this) {
        return String(value) === String(_this.get('socialSecurity')) ? false : true;
      },
      match: 'passwordConfirmation',
      mustContainCapital: true,
      mustContainLower: true,
      mustContainNumber: true,
      mustContainSpecial: true,
    },
    thing: {
      custom: [
        {
          validation: function (key, value) {
            return value !== 'blahblahblahblahbthishouldneverfaillahblahblah';
          },
        },
        {
          validation: function (key, value) {
            return value !== 'fail';
          },
        },
      ],
    },
    mySubdomain: {
      subdomain: { reserved: ['admin', 'blog'], message: 'this subdomain is super invalid' },
    },
    myBlog: {
      URL: true,
    },
    mainstreamCode: {
      format: { with: /^[a-zA-Z]+$/, message: "nu nu, that's not the format" },
    },
    legacyCode: {
      format: { with: /^[a-zA-Z]+$/ },
    },
    anInteger: {
      numericality: { onlyInteger: true },
    },
    anIntegerLessThan4: {
      numericality: { lessThan: 4 },
    },
    anIntegerGreaterThan4: {
      numericality: { greaterThan: 4 },
    },
    anIntegerGreaterThanOrEqual7: {
      numericality: { greaterThanOrEqualTo: 7 },
    },
    anIntegerLessThanOrEqual6: {
      numericality: { lessThanOrEqualTo: 6 },
    },
    aTenNumber: {
      numericality: { equalTo: 10 },
    },
    anOddNumber: {
      numericality: { odd: true },
    },
    anEvenNumber: {
      numericality: { even: true },
    },
    anOptionalNumber: {
      numericality: { onlyInteger: true, allowBlank: true },
    },
    alibabaNumber: {
      numericality: { message: 'is not abracadabra' },
    },
    lotteryNumber: {
      numericality: true,
      custom: {
        validation: function (key, value, _this) {
          var favColor = _this.get('favoriteColor');
          return !!favColor;
        },
        message: 'must have a favorite color to play the lotto, duh',
      },
    },
    acceptConditions: {
      acceptance: true,
    },
    postalCodeUS: {
      zipCode: true,
    },
    postalCodeUK: {
      zipCode: { countryCode: 'UK' },
    },
    postalCodeCA: {
      zipCode: { countryCode: 'CA' },
    },
    postalCodeZZ: {
      zipCode: { countryCode: 'ZZ' },
    },
    otherFakes: {
      relations: ['hasMany'],
    },
    otherFake: {
      presence: true,
      relations: ['belongsTo'],
    },
    otherCustomValidation: {
      custom: {
        validation: function (key, value) {
          return value.toString().length === 5 ? true : false;
        },
        message: function (key, value) {
          return `${key} must have exactly 5 digits, value ${value} does not`;
        },
      },
    },
    otherCustomValidationBadMessageFunction: {
      custom: {
        validation: function (key, value) {
          return value.toString().length === 5 ? true : false;
        },
        message: function () {
          return 12345;
        },
      },
    },
    date: {
      date: true,
    },
    stringDate: {
      date: true,
    },
    dateBefore2015: {
      date: {
        before: new Date(2015, 1, 1),
      },
    },
    dateAfter2014: {
      date: {
        after: new Date(2014, 12, 31),
      },
    },
  };
}

export default FakeModel;
