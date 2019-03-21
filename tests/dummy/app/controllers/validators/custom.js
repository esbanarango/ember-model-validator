import BaseContoller from './base';

export default BaseContoller.extend({
  modelName: 'for-custom',

  init() {
    this._super(...arguments);
    this.colors = ['Sarcoline', 'Coquelicot', 'Smaragdine', 'Mikado', 'Glaucous'];
  }
});
