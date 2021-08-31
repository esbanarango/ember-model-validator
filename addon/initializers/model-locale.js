export function initialize(application) {
  let validatorDefaultLocale = application.get('validatorDefaultLocale');
  if (validatorDefaultLocale) {
    application.register('validator:locale', { locale: validatorDefaultLocale }, { instantiate: false });
  }
}

export default {
  name: 'model-locale',
  initialize,
};
