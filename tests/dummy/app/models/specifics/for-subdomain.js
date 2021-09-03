import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class ForSubdomain extends Model {
  @attr('string') companySubdomain;

  validations = {
    companySubdomain: {
      subdomain: { reserved: ['admin', 'blog'] },
    },
  };
}

export default ForSubdomain;
