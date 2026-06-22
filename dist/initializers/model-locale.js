function initialize(application) {
  const validatorDefaultLocale = application.get('validatorDefaultLocale');
  if (validatorDefaultLocale) {
    application.register('validator:locale', {
      locale: validatorDefaultLocale
    }, {
      instantiate: false
    });
  }
}
var modelLocale = {
  name: 'model-locale',
  initialize
};

export { modelLocale as default, initialize };
//# sourceMappingURL=model-locale.js.map
