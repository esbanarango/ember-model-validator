import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

const {
  belongsTo,
  attr
} = DS;

export default DS.Model.extend(Validator,{
  relationYeah: belongsTo('specifics.for-presence'),
  happyWithMyRelation: attr('boolean'),

  validations: {
    happyWithMyRelation: {
      acceptance: true
    },
    relationYeah:{
      relations: ['belongsTo']
    }
  }
});
