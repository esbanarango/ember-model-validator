import Ember from 'ember';
import Messages from 'ember-model-validator/messages/en';

export default Ember.Controller.extend({
  // Services
  store: Ember.inject.service(),

  messages: Messages,

  init: function () {
    this._super();
    let model = this.get('store').createRecord(`specifics.${this.get('modelName')}`);
    this.set('model', model);
  },

  actions:{
    validate() {
      let model = this.get('model');
      model.validate();
      console.log(model.get('errors.content'));
    },
    reset() {
      let model = this.get('model');
      model.clearErrors();
    }
  }
});