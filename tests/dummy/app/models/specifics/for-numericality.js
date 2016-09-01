import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  anInteger: DS.attr('number'),
  anIntegerLessThan4: DS.attr('number'),
  anIntegerGreaterThan4: DS.attr('number'),
  anIntegerGreaterThanOrEqual7: DS.attr('number'),
  anIntegerLessThanOrEqual6: DS.attr('number'),
  aTenNumber: DS.attr('number'),
  anOddNumber: DS.attr('number'),
  anEvenNumber: DS.attr('number'),
  anOptionalNumber: DS.attr('number'),

  validations: {
    anInteger:{
      numericality: {onlyInteger: true }
    },
    anIntegerLessThan4:{
      numericality: {lessThan: 4}
    },
    anIntegerGreaterThan4:{
      numericality: {greaterThan: 4}
    },
    anIntegerGreaterThanOrEqual7:{
      numericality: {greaterThanOrEqualTo: 7}
    },
    anIntegerLessThanOrEqual6:{
      numericality: {lessThanOrEqualTo: 6}
    },
    aTenNumber:{
      numericality: {equalTo: 10}
    },
    anOddNumber:{
      numericality: {odd: true}
    },
    anEvenNumber:{
      numericality: {even: true}
    },
    anOptionalNumber:{
      numericality: {onlyInteger: true, allowBlank: true}
    }
  }
});
