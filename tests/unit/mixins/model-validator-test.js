/* jshint expr:true */
import { expect } from 'chai';
import { describeModel } from 'ember-mocha';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ModelValidatorMixin from '../../../mixins/model-validator';
import Messages from 'ember-model-validator/messages/en';
import PostalCodesRegex from 'ember-model-validator/postal-codes-regex';
import MessageFormater from '../../helpers/message-formater';

var formater = MessageFormater.create();

describe('ModelValidatorMixin', function() {

  // Replace this with your real tests.
  it('works', function() {
    var ValidatorObject = Ember.Object.extend(ModelValidatorMixin);
    var subject = ValidatorObject.create();
    expect(subject).to.be.ok;
  });

  describeModel('fake-model','Fake model with simple validations',
    {
      // Specify the other units that are required for this test.
      needs: ['model:other-model', 'model:async-model']
    },
    function() {
      // Replace this with your real tests.
      it('exists', function() {
        var model = this.subject();
        // var store = this.store();
        expect(model).to.be.ok;
      });

      describe('allowBlank option', function() {
        it('skips other validations when optional field is blank', function(){
          var model = this.subject({anOptionalNumber: null});
          model.validate();
          expect(model.get('errors').errorsFor('anOptionalNumber').length).to.equal(0);
        });
        it('runs remaining validations when optional field is not blank', function(){
          var model = this.subject({anOptionalNumber: 'abc'});
          expect(model.validate()).to.equal(false);
          expect(model.get('errors').errorsFor('anOptionalNumber').mapBy('message')[0][0]).to.equal(Messages.numericalityMessage);
          expect(model.get('errors').errorsFor('anOptionalNumber').mapBy('message')[1][0]).to.equal(Messages.numericalityOnlyIntegerMessage);
        });
      });
      describe('conditional option', function() {
        it('validates only if `if function` returns true', function(){
          var model = this.subject({condType: 'gallery'});
          model.validate();
          expect(model.get('errors').errorsFor('images').mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
        });
        it('skips validation if `if function` returns false', function(){
          var model = this.subject({condType: 'chancuncha'});
          model.validate();
          expect(model.get('errors').errorsFor('images').length).to.equal(0);
        });
      });
      describe('Presence validator', function() {
        it('validates the presence of the attributes set on `validations.presence`', function() {
          var model = this.subject(),
              errorAs = model.validations.name.presence.errorAs;
          delete model.validations.name.presence.errorAs;
          expect(model.validate()).to.equal(false);
          expect(model.get('errors').errorsFor('email').mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
          expect(model.get('errors').errorsFor('name').mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
          model.validations.name.presence['errorAs'] = errorAs;
        });
        describe('When is a relation', function() {
          it('validates the presence of the attributes set on `validations.presence` for Async relations', function() {
            var model = this.subject();
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('asyncModel').mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
          });

          it('validates the presence of the attributes set on `validations.presence` for embedded relations', function() {
            var model = this.subject();
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('otherFake').mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
          });
        });
      });
      it('validates the format of the attributes set on `validations.format`', function() {
        var model = this.subject({legacyCode: 3123123});
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('legacyCode').mapBy('message')[0][0]).to.equal(Messages.formatMessage);
      });

      it('validates the acceptance of the attributes set on `validations.acceptance`', function() {
        var model = this.subject({acceptConditions: 0});
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('acceptConditions').mapBy('message')[0][0]).to.equal(Messages.acceptanceMessage);
      });

      it('validates the matching of the attributes set on `validations.password`', function() {
        var model = this.subject({password: 'k$1hkjGd', passwordConfirmation: 'uuuu'});
        expect(model.validate()).to.equal(false);
        let context = {match: model._unCamelCase('passwordConfirmation')};
        expect(model.get('errors').errorsFor('password').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.matchMessage,context));
      });

      it('validates the absence of the attributes set on `validations.absence`', function() {
        var model = this.subject({login: 'asdasd'});
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('login').mapBy('message')[0][0]).to.equal(Messages.absenceMessage);
      });

      describe('Postalcode validation', function() {
        it('validates the zip code being invalid in the US', function() {
          var model = this.subject({postalCodeUS: 'dfasdfsad'});
          expect(model.validate()).to.equal(false);
          expect(model.get('errors').errorsFor('postalCodeUS').mapBy('message')[0][0]).to.equal(Messages.zipCodeMessage);
        });

        it('validates postal codes from outside US - UK', function() {
          var model = this.subject({postalCodeUK: '09011'});
          expect(model.validate()).to.equal(false);
          expect(model.get('errors').errorsFor('postalCodeUK').mapBy('message')[0][0]).to.equal(Messages.zipCodeMessage);
        });

        it('validates postal codes from outside US - CA', function() {
          var model = this.subject({postalCodeCA: '09011'});
          expect(model.validate()).to.equal(false);
          expect(model.get('errors').errorsFor('postalCodeCA').mapBy('message')[0][0]).to.equal(Messages.zipCodeMessage);
        });

        it('validates that non-existing country codes default to US behavior', function() {
          var model = this.subject({postalCodeZZ: 'dfasdfsad'});
          expect(model.validate()).to.equal(false);
          expect(model.get('errors').errorsFor('postalCodeZZ').mapBy('message')[0][0]).to.equal(Messages.zipCodeMessage);
        });
      });

      it('validates the truthyness of the user custom validation function on `validations.custom`', function(){
        var model = this.subject({password: 12345});
        expect(model.validate()).to.equal(false);
        expect( model.get('errors').errorsFor('password').mapBy('message')[0][0] ).to.equal(Messages.customValidationMessage);
      });

      it('validates the an array of custom validations', function(){
        var model = this.subject({thing: 'fail'});
        expect(model.validate()).to.equal(false);
        expect( model.get('errors').errorsFor('thing').mapBy('message')[0][0] ).to.equal(Messages.customValidationMessage);
      });

      it('validates the email format of the attributes set on `validations.email`', function() {
        var model = this.subject({email:'adsfasdf$'});
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('email').mapBy('message')[0][0]).to.equal(Messages.mailMessage);
      });

      it('validates the url format of the attributes set on `validations.url`', function() {
        var model = this.subject({myBlog:'//www.hola.com'});
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('myBlog').mapBy('message')[0][0]).to.equal(Messages.URLMessage);
      });

      it('validates the color format of the attributes set on `validations.color`', function() {
        var model = this.subject({favoritColor:'000XXX'}),
            message = model.validations.favoritColor.color.message;
        delete model.validations.favoritColor.color.message;
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('favoritColor').mapBy('message')[0][0]).to.equal(Messages.colorMessage);
        model.validations.favoritColor.color['message'] = message;
      });

      it('validates the numericality of the attributes set on `validations.numericality`', function() {
        var model = this.subject({lotteryNumber:'adsfasdf$'});
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('lotteryNumber').mapBy('message')[0][0]).to.equal(Messages.numericalityMessage);
      });

      it('validates the subdomain format of the attributes set on `validations.subdomain`', function() {
        var model = this.subject({mySubdomain:'with space'}),
            message = model.validations.mySubdomain.subdomain.message;
        delete model.validations.mySubdomain.subdomain.message;
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('mySubdomain').mapBy('message')[0][0]).to.equal(Messages.subdomainMessage);
        model.validations.mySubdomain.subdomain['message'] = message;
      });

      it('validates the inclusion of the attributes set on `validations.inclusion`', function() {
        var model = this.subject({name:'adsfasdf$'}),
            message = model.validations.name.inclusion.message;
        delete model.validations.name.inclusion.message;
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('name').mapBy('message')[0][0]).to.equal(Messages.inclusionMessage);
        model.validations.name.inclusion['message'] = message;
      });

      it('validates the exclusion of the attributes set on `validations.exclusion`', function() {
        var model = this.subject({secondName:'Wilder Medina'}),
            message = model.validations.secondName.exclusion.message;
        delete model.validations.secondName.exclusion.message;
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('secondName').mapBy('message')[0][0]).to.equal(Messages.exclusionMessage);
        model.validations.secondName.exclusion['message'] = message;
      });
      // Numericality validator
      describe('Numericality validator', function() {
        describe('`onlyInteger` option', function() {
          it('validates the number for only being an integer', function() {
            var model = this.subject({anInteger:1.3});
            Ember.run(function() {
              expect(model.validate({only:['anInteger']})).to.equal(false);
              expect(model.get('errors').errorsFor('anInteger').mapBy('message')[0][0]).to.equal(Messages.numericalityOnlyIntegerMessage);
            });
          });
        });

        describe('`greaterThan` option', function() {
          it('validates that the number is `greater than` the specified value', function() {
            var model = this.subject({anIntegerGreaterThan4:2});
            Ember.run(function() {
              expect(model.validate({only:['anIntegerGreaterThan4']})).to.equal(false);
              let context = {count: 4};
              expect(model.get('errors').errorsFor('anIntegerGreaterThan4').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.numericalityGreaterThanMessage, context));
            });
          });
        });

        describe('`greaterThanOrEqualTo` option', function() {
          it('validates that the number is `greater than or equal` to the specified value', function() {
            var model = this.subject({anIntegerGreaterThanOrEqual7:2});
            Ember.run(function() {
              expect(model.validate({only:['anIntegerGreaterThanOrEqual7']})).to.equal(false);
              let context = {count: 7};
              expect(model.get('errors').errorsFor('anIntegerGreaterThanOrEqual7').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.numericalityGreaterThanOrEqualToMessage, context));
            });
          });
        });

        describe('`equalTo` option', function() {
          it('validates that the number is `greater than or equal` to the specified value', function() {
            var model = this.subject({aTenNumber:2});
            Ember.run(function() {
              expect(model.validate({only:['aTenNumber']})).to.equal(false);
              let context = {count: 10};
              expect(model.get('errors').errorsFor('aTenNumber').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.numericalityEqualToMessage, context));
            });
          });
        });

        describe('`lessThan` option', function() {
          it('validates that the number is `less than` the specified value', function() {
            var model = this.subject({anIntegerLessThan4:5});
            Ember.run(function() {
              expect(model.validate({only:['anIntegerLessThan4']})).to.equal(false);
              let context = {count: 4};
              expect(model.get('errors').errorsFor('anIntegerLessThan4').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.numericalityLessThanMessage, context));
            });
          });
        });

        describe('`lessThanOrEqualTo` option', function() {
          it('validates that the number is `less than or equal` to the specified value', function() {
            var model = this.subject({anIntegerLessThanOrEqual6:8});
            Ember.run(function() {
              expect(model.validate({only:['anIntegerLessThanOrEqual6']})).to.equal(false);
              let context = {count: 6};
              expect(model.get('errors').errorsFor('anIntegerLessThanOrEqual6').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.numericalityLessThanOrEqualToMessage, context));
            });
          });
        });

        describe('`odd` option', function() {
          it('validates that the number is `odd`', function() {
            var model = this.subject({anOddNumber:2});
            Ember.run(function() {
              expect(model.validate({only:['anOddNumber']})).to.equal(false);
              expect(model.get('errors').errorsFor('anOddNumber').mapBy('message')[0][0]).to.equal(Messages.numericalityOddMessage);
            });
          });
        });

        describe('`even` option', function() {
          it('validates that the number is `even`', function() {
            var model = this.subject({anEvenNumber:3});
            Ember.run(function() {
              expect(model.validate({only:['anEvenNumber']})).to.equal(false);
              expect(model.get('errors').errorsFor('anEvenNumber').mapBy('message')[0][0]).to.equal(Messages.numericalityEvenMessage);
            });
          });
        });
      });

      describe('Date Validator', function(){
        it('validates a date object', function(){
          var model = this.subject({date: new Date('a')});
          Ember.run(function(){
            expect(model.validate({only: ['date']})).to.equal(false);
            expect(model.get('errors').errorsFor('date').mapBy('message')[0][0]).to.equal(Messages.dateMessage);
          });
        });
        it('validates a date string', function(){
          var model = this.subject({stringDate: '2015-13-1'});
          Ember.run(function(){
            expect(model.validate({only: ['stringDate']})).to.equal(false);
            expect(model.get('errors').errorsFor('stringDate').mapBy('message')[0][0]).to.equal(Messages.dateMessage);
          });
        });
        it('validates that the date is `before` the specified value', function(){
          var model = this.subject({dateBefore2015: '2015-10-31'});
          Ember.run(function(){
            expect(model.validate({only: ['dateBefore2015']})).to.equal(false);
            let context = {date: new Date(2015, 1, 1)};
            expect(model.get('errors').errorsFor('dateBefore2015').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.dateBeforeMessage, context));
          });
        });
        it('validates that the date is `after` the specified value', function(){
          var model = this.subject({dateAfter2014: '2015-01-01'});
          Ember.run(function(){
            expect(model.validate({only: ['dateAfter2014']})).to.equal(false);
            let context = {date: new Date(2014, 12, 31)};
            expect(model.get('errors').errorsFor('dateAfter2014').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.dateAfterMessage, context));
          });
        });
      });

      describe('Length validator', function() {
        describe('exact Length', function() {
          describe('when is set to a number', function() {
            it('validates the length of the attributes set on `validations.length`', function() {
              var model = this.subject({socialSecurity:123});
              Ember.run(function() {
                expect(model.validate({only:['socialSecurity']})).to.equal(false);
                let context = {count: 5};
                expect(model.get('errors').errorsFor('socialSecurity').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.wrongLengthMessage, context));
              });
            });
          });

          describe('when `is` is used to set the number', function() {
            it('validates the length of the attributes set on `validations.length`', function() {
              var model = this.subject({chuncaluchoNumber:123});
              Ember.run(function() {
                expect(model.validate({only:['chuncaluchoNumber']})).to.equal(false);
                expect(model.get('errors').errorsFor('chuncaluchoNumber').mapBy('message')[0][0]).to.equal('this is not the length of a chuncalucho');
              });
            });
          });

          describe('when `message` is set for `minimum` or `maximum` option', function() {
            it('validates the length of the attributes set on `validations.length`', function() {
              var model = this.subject({theMinimunmTwoNumber:'1'});
              Ember.run(function() {
                expect(model.validate({only:['theMinimunmTwoNumber']})).to.equal(false);
                expect(model.get('errors').errorsFor('theMinimunmTwoNumber').mapBy('message')[0][0]).to.equal('please it has to be minimum 2 come on man!!');
              });
            });
          });

        });

        describe('range Length', function() {
          describe('when is set to an array', function() {
            it('validates the length of the attributes set on `validations.length`', function() {
              var model = this.subject({nsaNumber:12});
              Ember.run(function() {
                expect(model.validate({only:['nsaNumber']})).to.equal(false);
                let context = {count: 3};
                expect(model.get('errors').errorsFor('nsaNumber').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.tooShortMessage, context));
              });
            });
          });

          describe('when is set using `minimum` and `maximum` keys', function() {
            it('validates the length of the attributes set on `validations.length`', function() {
              var model = this.subject({hugeName:123456});
              Ember.run(function() {
                expect(model.validate({only:['hugeName']})).to.equal(false);
                let context = {count: 5};
                expect(model.get('errors').errorsFor('hugeName').mapBy('message')[0][0]).to.equal(formater.formatMessage(Messages.tooLongMessage, context));
              });
            });
          });
        });
      });

      // Length validation testing is handled above
      describe('Password validations', function() {
        it('accepts a string that meets all validation requirements', function() {
          var model = this.subject({ password: 'k$1hkjGd', passwordConfirmation: 'k$1hkjGd' });
          Ember.run(function() {
            expect(model.validate({only:['password']})).to.equal(true);
          });
        });

        describe('capital character validation', function() {
          it('rejects a string that does not contain a capital character', function() {
            var model = this.subject({ password: 'k$1hkjgd' });
            Ember.run(function() {
              expect(model.validate({ only:['password'] })).to.equal(false);
            });
          });
        });

        describe('lower case character validation', function() {
          it('rejects a string that does not contain a lower case character', function() {
            var model = this.subject({ password: 'k$1hkjgd' });
            Ember.run(function() {
              expect(model.validate({ only:['password'] })).to.equal(false);
            });
          });
        });

        describe('special character validation', function() {
          it('rejects a string that does not contain a special character', function() {
            var model = this.subject({ password: 'kW1hkjgd' });
            Ember.run(function() {
              expect(model.validate({ only:['password'] })).to.equal(false);
            });
          });
        });

        describe('number validation', function() {
          it('rejects a string that does not contain a number', function() {
            var model = this.subject({ password: 'k$Whkjgd' });
            Ember.run(function() {
              expect(model.validate({ only:['password'] })).to.equal(false);
            });
          });
        });
      });

      describe('Relations validations', function() {
        describe('`hasMany` relations', function() {
          it('validates the relations specified on `validations.relations`', function() {
            var model = this.subject({email:'thiisagoo@email.con',name:'Jose Rene Higuita'}),
                store = model.get('store'),
                otherFakes = null;

            Ember.run(function() {
              otherFakes = model.get('otherFakes');

              otherFakes.pushObject(store.createRecord('other-model'));
              expect(model.validate({only:['otherFakes']})).to.equal(false);
            });

          });
        });

        describe('`belongsTo` relations', function() {
          it('validates the relations specified on `validations.relations`', function() {
            var model = this.subject({email:'thiisagoo@email.con',name:'Jose Rene Higuita'}),
                store = model.get('store'),
                otherFakes = null;

            Ember.run(function() {
              model.set('otherFake',store.createRecord('other-model'));
              expect(model.validate({only:['otherFake']})).to.equal(false);
              expect(model.get('otherFake.errors').errorsFor('name').mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
            });

          });
        });

      });
      describe('Acceptance validator', function() {

        it('returns false when the attribute value is not in the list of acceptable values', function(){
          var model = this.subject({ acceptConditions: 10});
          Ember.run(function(){
            expect(model.validate({only:['acceptConditions']})).to.equal(false);
          });
        });

      });

      describe('when custom message is set', function() {

        it('validates the presence of the attributes set on `validations.presence` and use the correct message', function() {
          var model = this.subject({bussinessEmail:''});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('bussinessEmail').mapBy('message')[0][0]).to.equal(model.validations.bussinessEmail.presence.message);
          });
        });

        it('validates the truthyness of user func for `validations.custom` and use the correct message', function() {
          var model = this.subject({lotteryNumber: 777});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('lotteryNumber').mapBy('message')[0][0]).to.equal(model.validations.lotteryNumber.custom.message);
          });
        });

        it('validates the email format of the attributes set on `validations.email` and use the correct message', function() {
          var model = this.subject({bussinessEmail:'adsfasdf$'});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('bussinessEmail').mapBy('message')[0][0]).to.equal(model.validations.bussinessEmail.email.message);
          });
        });

        it('validates the color format of the attributes set on `validations.color` and use the correct message', function() {
          var model = this.subject({favoritColor:'adsfasdf$'});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('favoritColor').mapBy('message')[0][0]).to.equal(model.validations.favoritColor.color.message);
          });
        });

        it('validates the subdomain format of the attributes set on `validations.subdomain` and use the correct message', function() {
          var model = this.subject({mySubdomain:'with space'});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('mySubdomain').mapBy('message')[0][0]).to.equal(model.validations.mySubdomain.subdomain.message);
          });
        });

        it('validates the subdomain reserved words of the attributes set on `validations.subdomain` and use the correct message', function() {
          var model = this.subject({mySubdomain:'admin'});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('mySubdomain').mapBy('message')[0][0]).to.equal(model.validations.mySubdomain.subdomain.message);
          });
        });

        it('validates the format of the attributes set on `validations.format` and use the correct message', function() {
          var model = this.subject({mainstreamCode: 3123123});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('mainstreamCode').mapBy('message')[0][0]).to.equal(model.validations.mainstreamCode.format.message);
          });
        });

        it('validates the inclusion of the attributes set on `validations.inclusion` and use the correct message', function() {
          var model = this.subject({name:'adsfasdf$'});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('name').mapBy('message')[0][0]).to.equal(model.validations.name.inclusion.message);
          });
        });

        it('validates the exclusion of the attributes set on `validations.exclusion` and use the correct message', function() {
          var model = this.subject({secondName:'Wilder Medina'});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('secondName').mapBy('message')[0][0]).to.equal(model.validations.secondName.exclusion.message);
          });
        });

        it('validates the numericality of the attributes set on `validations.numericality`', function() {
          var model = this.subject({alibabaNumber:'adsfasdf$'});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('alibabaNumber').mapBy('message')[0][0]).to.equal(model.validations.alibabaNumber.numericality.message);
          });
        });

        describe('When custom message is a function', function(){

          describe('and function returns a string',function(){
            it('set error message using the function return', function(){
              var model = this.subject({otherCustomValidation: 123456 });
              Ember.run(function() {
                expect(model.validate()).to.equal(false);
                expect(model.get('errors').errorsFor('otherCustomValidation').mapBy('message')[0][0]).to
                  .equal(model.validations.otherCustomValidation.custom.message.call('otherCustomValidation', model.get('otherCustomValidation'), model));
              });
            });
          });

          describe('and function does not return a string', function() {
            it('set error message to default message', function(){
              var model = this.subject({otherCustomValidationBadMessageFunction: 123456 });
              Ember.run(function() {
                expect(model.validate()).to.equal(false);
                expect(model.get('errors').errorsFor('otherCustomValidationBadMessageFunction').mapBy('message')[0][0]).to.equal(Messages.customValidationMessage);
              });
            });
          });
        });
      });

      describe('when errorAs is set', function() {

        it('validates the presence of the attributes set on `validations.presence` and add errors to `errorAs`', function() {
          var model = this.subject(),
              errorAs = model.validations.name.presence.errorAs;
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor(errorAs).mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
          });
        });

      });

      describe('when data is corrected after validation', function() {

        it('it clean the errors', function() {
          var model = this.subject({email:'adsfasdf$',name:'Jose Rene',lotteryNumber:124,alibabaNumber:33,legacyCode:'abc', acceptConditions: 1, password: 'k$1hkjGd', favoriteColor: 'FFFFFF', socialSecurity: 12312}),
              store = model.get('store');
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            var asyncModel = store.createRecord('async-model');
            var otherFake = store.createRecord('other-model',{name:'aaa',email:'aaa@aa.com'});
            model.set('password','k$1hkjGd');
            model.set('passwordConfirmation','k$1hkjGd');
            model.set('email','rene@higuita.com');
            model.set('images','las images');
            model.set('asyncModel',asyncModel);
            model.set('otherFake',otherFake);
            expect(model.validate()).to.equal(true);
          });
        });
      });

      describe('when `addErrors` is passed to `validate`', function() {

        it('it validates all the attributes but does not add errors', function() {
          var model = this.subject({email:'adsfasdf$',name:'Jose Rene',lotteryNumber:124,alibabaNumber:33,legacyCode:'abc', acceptConditions: 1, password: 'k$1hkjGd', favoriteColor: 'FFFFFF', socialSecurity: 12312});
          Ember.run(function() {
            model.set('password','k$1hkjGd');
            model.set('passwordConfirmation','k$1hkjGd');
            expect(model.validate({addErrors: false})).to.equal(false);
            expect(model.get('errors').errorsFor('email').mapBy('message').length).to.equal(0);
            expect(model.validate()).to.equal(false);
            expect(model.get('errors').errorsFor('email').mapBy('message').length).to.equal(1);
          });
        });
      });

      describe('when `except` is passed to `validate`', function() {

        it('it validates all the attributes except the ones specifed', function() {
          var model = this.subject({email:'adsfasdf$',name:'Jose Rene',lotteryNumber:124,alibabaNumber:33,legacyCode:'abc', acceptConditions: 1, password: 'k$1hkjGd', favoriteColor: 'FFFFFF', socialSecurity: 12312});
          Ember.run(function() {
            model.set('password','k$1hkjGd');
            model.set('passwordConfirmation','k$1hkjGd');
            model.set('email','rene@higuita.com');
            model.set('images','las images');
            expect(model.validate()).to.equal(false);
            expect(model.validate({except:['asyncModel','otherFake']})).to.equal(true);
          });
        });
      });

      describe('when `only` is passed to `validate`', function() {

        it('it validates only the attributes specifed', function() {
          var model = this.subject({email:'adsfasdf$',name:'Jose Rene',lotteryNumber:124,alibabaNumber:33,legacyCode:'abc'});
          Ember.run(function() {
            expect(model.validate()).to.equal(false);
            model.set('email','user.name+1@gmail.com');
            expect(model.validate({only:['email']})).to.equal(true);
          });
        });
      });
    }
  );
});
