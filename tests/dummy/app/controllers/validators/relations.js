import BaseContoller from './base';

export default BaseContoller.extend({
  modelName: 'for-relations',

  init: function () {
    this._super();
    let modelRelation = this.get('store').createRecord('specifics.for-presence');
    let model = this.get('model');
    model.set('relationYeah', modelRelation);
    this.set('modelRelation', modelRelation);
    this.fruits = ['Spanish Lime','Soursop','Mamey Sapote','Alibertia patinoi','Mango'];
  }
});
