import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  agree: DS.attr('boolean'),

  validations: {
    agree: {
      acceptance: true
    },
  }
});
