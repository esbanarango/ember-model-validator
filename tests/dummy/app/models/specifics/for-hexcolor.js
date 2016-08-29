import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  favoriteColor: DS.attr('string'),

  validations: {
    favoriteColor: {
      color: true
    }
  }
});
