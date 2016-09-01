import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  lotteryNumber: DS.attr('number'),
  favoriteColor:  DS.attr('string'),

  validations: {
    lotteryNumber: {
      custom: {
        validation: function(key, value, _this){
          var favColor = _this.get('favoriteColor');
          return !!favColor;
        },
        message: 'must have a favorite color to play the lotto, duh'
      }
    },
  }
});
