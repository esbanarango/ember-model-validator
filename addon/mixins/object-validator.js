import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import Validation from 'ember-model-validator/mixins/model-validator';

export default Mixin.create(Validation, {
  errors: DS.Errors.create(),

  clearErrors() {
    this.set('errors', DS.Errors.create());
  },

  pushErrors(errors){
    for(let attribute in errors){
      let messages = errors[attribute];
      this.get('errors').add(attribute, messages);
    }
  },
  _modelRelations() {}
});
