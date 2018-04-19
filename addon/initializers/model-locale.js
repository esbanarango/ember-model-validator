export function initialize() {
  let application = arguments[1] || arguments[0];
  let validatorDefaultLocale = application.get('validatorDefaultLocale');
  if (validatorDefaultLocale) {
    application.register('validator:locale', validatorDefaultLocale, { instantiate: false });
  }
}

export default {
  name: 'model-locale',
  initialize
};
