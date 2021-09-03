import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForDate extends Model {
  @attr('date') birthdate;
  @attr('date') graduationDate;

  validations = {
    birthdate: {
      date: {
        before: new Date(),
      },
    },
    graduationDate: {
      date: {
        after: '2015-01-01',
      },
    },
  };
}

export default ForDate;
