import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator,{
  name: DS.attr('string'),
  login: DS.attr('string'),
  secondName: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  passwordConfirmation: DS.attr('string'),
  bussinessEmail: DS.attr('string', {defaultValue: 'donJoseRene@higuita.com'}),
  favoritColor: DS.attr('string', {defaultValue: '423abb'}),
  legacyCode: DS.attr('string'),
  mainstreamCode: DS.attr('string', {defaultValue: 'hiphopBachatudo'}),
  lotteryNumber: DS.attr('number'),
  alibabaNumber: DS.attr('number'),
  acceptConditions: DS.attr('boolean', {defaultValue: true}),

  socialSecurity: DS.attr('number', {defaultValue: 12345}),

  nsaNumber: DS.attr('number', {defaultValue: 1234}),

  chuncaluchoNumber: DS.attr('number', {defaultValue: 1234567891}),

  hugeName: DS.attr('string', {defaultValue: 12345}),

  postalCode:  DS.attr('string', {defaultValue: '09011'}),

  mySubdomain: DS.attr('string', {defaultValue: 'fake_subdomain'}),

  myBlog: DS.attr('string', {defaultValue: 'http://esbanarango.com'}),

  otherFakes: DS.hasMany('other-model'),

  otherFake: DS.belongsTo('other-model'),

  thing: DS.attr(''),

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
    socialSecurity: {
      length: 5
    },
    nsaNumber: {
      length: [3, 5]
    },
    chuncaluchoNumber: {
      length: { is: 10, message: 'this is not the length of a chuncalucho' }
    },
    hugeName:{
      length: {
        minimum: 3,
        maximum: 5,
      }
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
    password: {
      custom: function(key, value, _this){
        return String(value) === String(_this.get('socialSecurity')) ? false : true;
      },
      match: 'passwordConfirmation',
      mustContainCapital: true,
      mustContainLower: true,
      mustContainNumber: true,
      mustContainSpecial: true
    },
    thing: {
      custom: [
        {
          validation: function(key, value, _this){
            return (value !== 'blahblahblahblahbthishouldneverfaillahblahblah');
          }
        },
        {
          validation: function(key, value, _this){
            return (value !== 'fail');
          }
        }
      ]
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
      numericality: true,
      custom: {
        validation: function(key, value, _this){
          var favColor = _this.get('favoriteColor');
          return !!favColor;
        },
        message: 'must have a favorite color to play the lotto, duh'
      }
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
