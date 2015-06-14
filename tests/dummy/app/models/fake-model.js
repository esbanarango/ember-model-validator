import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator,{
  name: DS.attr('string'),
  login: DS.attr('string'),
  secondName: DS.attr('string'),
  email: DS.attr('string'),
  bussinessEmail: DS.attr('string'),
  favoritColor: DS.attr('string'),
  legacyCode: DS.attr('string'),
  mainstreamCode: DS.attr('string'),
  lotteryNumber: DS.attr('number'),
  alibabaNumber: DS.attr('number'),
  acceptConditions: DS.attr('boolean'),

  postalCode:  DS.attr('string'),

  mySubdomain: DS.attr('string'),

  myBlog: DS.attr('string'),

  otherFakes: DS.hasMany('other-model'),

  otherFake: DS.belongsTo('other-model'),

  validations: {
    name: {
      presence: { errorAs:'profile.name' },
      inclusion: { in: ['Jose Rene', 'Aristi Gol', 'Armani'], message: 'Solo verde a morir' }
    },
    login: {
      absence: true
    },
    secondName: {
      exclusion: { in: ['Gionvany Hernandez', 'Wilder Medina'], message: 'Que iNrresponsabilidad' }
    },
    bussinessEmail: {
      presence: { message: 'sup dude, where\'s da email' },
      email: { message: 'Be professional ma men' }
    },
    favoritColor:{
      color: { message: 'not a hex color' }
    },
    email: {
      presence: true,
      email: true
    },
    mySubdomain:{
      subdomain:{ reserved:['admin','blog'], message: 'this subdomain is super invalid' }
    },
    myBlog: {
      URL: true
    },
    mainstreamCode: {
      format: { with: /^[a-zA-Z]+$/, message: 'nu nu, that\'s not the format' }
    },
    legacyCode:{
      format: { with: /^[a-zA-Z]+$/ }
    },
    alibabaNumber: {
      numericality: { message: 'is not abracadabra' }
    },
    lotteryNumber: {
      numericality: true
    },
    acceptConditions: {
      acceptance: true
    },
    postalCode:{
      zipCode: true
    },
    otherFakes:{
      relations: ['hasMany']
    },
    otherFake:{
      relations: ['belongsTo']
    }
  }

});
