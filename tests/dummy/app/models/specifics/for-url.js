import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  blogUrl: DS.attr('string'),

  validations: {
    blogUrl: {
      URL: true
    }
  }
});
