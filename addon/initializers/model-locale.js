export function initialize() {
  let application = arguments[1] || arguments[0];
  let defaultLocale = application.get('defaultLocale');
  application.register('validator:locale', defaultLocale, { instantiate: false });
}

export default {
  name: 'model-locale',
  initialize
};
