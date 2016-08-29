import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  autoGenerate: DS.attr('string'),

  validations: {
    autoGenerate: {
      absence: true
    }
  }
});