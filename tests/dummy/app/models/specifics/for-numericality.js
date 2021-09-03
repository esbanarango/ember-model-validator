import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForNumericality extends Model {
  @attr('number') anInteger;
  @attr('number') anIntegerLessThan4;
  @attr('number') anIntegerGreaterThan4;
  @attr('number') anIntegerGreaterThanOrEqual7;
  @attr('number') anIntegerLessThanOrEqual6;
  @attr('number') aTenNumber;
  @attr('number') anOddNumber;
  @attr('number') anEvenNumber;
  @attr('number') anOptionalNumber;

  validations = {
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
  };
}

export default ForNumericality;
