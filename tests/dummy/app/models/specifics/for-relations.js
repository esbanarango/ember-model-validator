import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import Validator from '../../mixins/model-validator';

export default Model.extend(Validator, {
  relationYeah: belongsTo('specifics.for-presence'),
  happyWithMyRelation: attr('boolean'),

  init() {
    this._super(...arguments);
    this.validations = {
      happyWithMyRelation: {
        acceptance: true
      },
      relationYeah: {
        relations: ['belongsTo']
      }
    };
  }
});
