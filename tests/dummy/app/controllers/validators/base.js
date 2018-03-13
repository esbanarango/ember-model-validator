import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import Messages from 'ember-model-validator/messages/en';

export default Controller.extend({
  // Services
  store: service(),

  messages: Messages,
  modelValid: true,

  init: function () {
    this._super();
    let model = this.get('store').createRecord(`specifics.${this.get('modelName')}`);
    this.set('model', model);
  },

  actions:{
    validate() {
      let model = this.get('model');
      if(model.validate()){
        this.set('modelValid', true);
      }else{
        this.set('modelValid', false);
      }
    },
    reset() {
      let model = this.get('model');
      model.clearErrors();
    }
  }
});