import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  secretLettersCode: DS.attr('string'),
  secretNumericCode: DS.attr('string'),

  validations: {
    secretLettersCode: {
      format: { with: /^[a-zA-Z]+$/, message: 'Only letters pls' }
    },
    secretNumericCode:{
      format: { with: /^[0-9]+$/, message: 'Only numbers pls' }
    },
  }
});