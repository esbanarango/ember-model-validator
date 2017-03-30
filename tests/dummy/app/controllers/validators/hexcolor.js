import BaseContoller from './base';

export default BaseContoller.extend({
  modelName: 'for-hexcolor',

  actions:{
    validate() {
      this._super();
      const modelValid = this.get('modelValid');
      let canvas = document.getElementById('canvas-color'),
          ctx = canvas.getContext('2d');
      if(modelValid){
        ctx.fillStyle = `#${this.get('model.favoriteColor')}`;
        ctx.font = '45px Arial';
        ctx.fillText('Ember',35,60);
      }else{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }
});