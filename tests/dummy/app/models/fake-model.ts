import Model, { attr, belongsTo, hasMany, type AsyncBelongsTo, type AsyncHasMany } from '@ember-data/model';

import { modelValidator, type ValidationsConfig, type ValidatedModel } from 'ember-model-validator';
import type AsyncModel from './async-model';
import type OtherModel from './other-model';

interface FakeModel extends ValidatedModel, Model {}

@modelValidator
class FakeModel extends Model {
  @attr('string') declare name: string;
  @attr('string') declare login: string;
  @attr('string') declare secondName: string;
  @attr('string') declare email: string;
  @attr('string') declare password: string;
  @attr('string') declare passwordConfirmation: string;
  @attr('string', { defaultValue: 'donJoseRene@higuita.com' }) declare bussinessEmail: string;
  @attr('string', { defaultValue: '423abb' }) declare favoriteColor: string;
  @attr('string') declare legacyCode: string;
  @attr('string', { defaultValue: 'hiphopBachatudo' }) declare mainstreamCode: string;
  @attr('number') declare lotteryNumber: number;
  @attr('number') declare alibabaNumber: number;
  @attr('number', { defaultValue: 111 }) declare anInteger: number;
  @attr('number', { defaultValue: 5 }) declare anIntegerGreaterThan4: number;
  @attr('number', { defaultValue: 3 }) declare anIntegerLessThan4: number;
  @attr('number', { defaultValue: 7 }) declare anIntegerGreaterThanOrEqual7: number;
  @attr('number', { defaultValue: 6 }) declare anIntegerLessThanOrEqual6: number;
  @attr('number', { defaultValue: 10 }) declare aTenNumber: number;
  @attr('number', { defaultValue: 3 }) declare anOddNumber: number;
  @attr('number', { defaultValue: 2 }) declare anEvenNumber: number;
  @attr('number', { defaultValue: undefined }) declare anOptionalNumber: number | null;
  @attr('boolean', { defaultValue: true }) declare acceptConditions: boolean;
  @attr('number', { defaultValue: 12345 }) declare socialSecurity: number;
  @attr('number', { defaultValue: 1234 }) declare nsaNumber: number;
  @attr('number', { defaultValue: 1234567891 }) declare chuncaluchoNumber: number;
  @attr('number', { defaultValue: 3223 }) declare theMinimunmTwoNumber: number;
  @attr('number', { defaultValue: 3223222222 }) declare theMinimunmInterpolatedTenNumber: number;
  @attr('number', { defaultValue: 12345 }) declare hugeName: number;
  @attr('string', { defaultValue: '09011' }) declare postalCodeUS: string;
  @attr('string', { defaultValue: 'KY16 8BP' }) declare postalCodeUK: string;
  @attr('string', { defaultValue: 'T2A2V8' }) declare postalCodeCA: string;
  @attr('string', { defaultValue: '09011' }) declare postalCodeZZ: string;
  @attr('string', { defaultValue: 'fake_subdomain' }) declare mySubdomain: string;
  @attr('string', { defaultValue: 'http://esbanarango.com' }) declare myBlog: string;
  @attr() declare thing: any;
  @attr('number', { defaultValue: 12345 }) declare otherCustomValidation: number;
  @attr('number', { defaultValue: 12345 }) declare otherCustomValidationBadMessageFunction: number;
  @attr() declare images: any;
  @attr('string') declare condType: string;

  @hasMany('other-model', { async: true, inverse: null }) declare otherFakes: AsyncHasMany<OtherModel>;
  @belongsTo('other-model', { async: true, inverse: null }) declare otherFake: AsyncBelongsTo<OtherModel>;
  @belongsTo('async-model', { async: false, inverse: null }) declare asyncModel: AsyncModel;

  @attr('date', {
    defaultValue() {
      return new Date();
    },
  })
  declare date: Date;

  @attr('string', { defaultValue: '2015-01-01' }) declare stringDate: string;
  @attr('date', {
    defaultValue() {
      return new Date(2014, 7, 1);
    },
  })
  declare dateBefore2015: Date;

  @attr('date', {
    defaultValue() {
      return new Date(2015, 5, 3);
    },
  })
  declare dateAfter2014: Date;

  validations: ValidationsConfig = {
    asyncModel: {
      presence: true,
    },
    name: {
      presence: { errorAs: 'profile.name' },
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'], message: 'Solo verde a morir' },
    },
    images: {
      presence: {
        if: function (key: string, value: any, _this: FakeModel) {
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
      custom: function (key: string, value: any, _this: FakeModel) {
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
          validation: function (key: string, value: any) {
            return value !== 'blahblahblahblahbthishouldneverfaillahblahblah';
          },
        },
        {
          validation: function (key: string, value: any) {
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
        validation: function (key: string, value: any, _this: FakeModel) {
          const favColor = _this.get('favoriteColor');
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
        validation: function (key: string, value: any) {
          return value.toString().length === 5 ? true : false;
        },
        message: function (key: string, value: any) {
          return `${key} must have exactly 5 digits, value ${value} does not`;
        },
      },
    },
    otherCustomValidationBadMessageFunction: {
      custom: {
        validation: function (key: string, value: any) {
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

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'fake-model': FakeModel;
  }
}

export default FakeModel;
