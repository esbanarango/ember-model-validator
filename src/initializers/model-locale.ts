import type Application from '@ember/application';
export function initialize(application: Application) {
  const validatorDefaultLocale = application.get('validatorDefaultLocale');
  if (validatorDefaultLocale) {
    application.register(
      'validator:locale',
      { locale: validatorDefaultLocale },
      { instantiate: false },
    );
  }
}

export default {
  name: 'model-locale',
  initialize,
};
