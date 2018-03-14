import BaseContoller from './base';

export default BaseContoller.extend({
  modelName: 'for-presence',

  init() {
    this._super(...arguments);
    this.fruits = ['Spanish Lime', 'Soursop', 'Mamey Sapote', 'Alibertia patinoi', 'Mango'];
  }
});
