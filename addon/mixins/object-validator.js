import Ember from 'ember';
import DS from 'ember-data';
import Validation from 'ember-model-validator/mixins/model-validator';

export default Ember.Mixin.create(Validation, {
  errors: DS.Errors.create(),

  clearErrors() {
    this.set('errors', DS.Errors.create());
  },

  pushErrors(errors){
    for(var attribute in errors){
      let messages = errors[attribute];
      this.get('errors').add(attribute, messages);
    }
  },

  _modelRelations() {}
});