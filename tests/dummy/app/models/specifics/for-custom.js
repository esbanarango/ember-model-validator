import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
  lotteryNumber: attr('number'),
  favoriteColor: attr('string'),

  init() {
    this._super(...arguments);
    this.validations = {
      lotteryNumber: {
        custom: {
          validation: function(key, value, _this) {
            var favColor = _this.get('favoriteColor');
            return !!favColor;
          },
          message: '🤦‍♂️ must have a favorite color to play the lotto, duh'
        }
      }
    };
  }
});
