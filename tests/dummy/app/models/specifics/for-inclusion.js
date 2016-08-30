import DS from 'ember-data';
import Validator from '../../mixins/model-validator';

export default DS.Model.extend(Validator,{
  playerName: DS.attr('string'),

  validations: {
    playerName: {
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'] }
    }
  }
});
