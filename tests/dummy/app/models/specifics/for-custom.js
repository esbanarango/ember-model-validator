import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForCustom extends Model {
  @attr('number') lotteryNumber;
  @attr('string') favoriteColor;

  validations = {
    lotteryNumber: {
      custom: {
        validation: function (key, value, _this) {
          var favColor = _this.get('favoriteColor');
          return !!favColor;
        },
        message: '🤦‍♂️ must have a favorite color to play the lotto, duh',
      },
    },
  };
}

export default ForCustom;
