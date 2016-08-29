import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  companySubdomain: DS.attr('string'),

  validations: {
    companySubdomain:{
      subdomain:{ reserved:['admin','blog'] }
    }
  }
});
