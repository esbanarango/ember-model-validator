import DS from 'ember-data';
import Validator from '../mixins/validator';

export default DS.Model.extend(Validator,{
  name: DS.attr('string'),
  secondName: DS.attr('string'),
  email: DS.attr('string'),

  legacyCode: DS.attr('string'),
  lotteryNumber: DS.attr('number'),

  otherFakes: DS.hasMany('other-model'),

  validations: {
    name: {
      presence: true,
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'] }
    },
    secondName: {
      exclusion: { in: ['Gionvany Hernandez', 'Wilder Medina'] }
    },
    email: {
      presence: true,
      email: true
    },
    legacyCode:{
      format: {with: /^[a-zA-Z]+$/}
    },
    lotteryNumber: {
      numericality: true
    },
    otherFakes:{
      relations: ['hasMany']
    }
  }

});
