/* eslint-env node */
'use strict';
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    babel: {
      // enable "loose" mode
      loose: true,
      exclude: [],
      plugins: [],
    },
    'ember-prism': {
      theme: 'okaidia',
      components: ['javascript', 'handlebars', 'markup-templating'],
    },
    sassOptions: {
      implementation: require('sass'),
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  // Import Highlight.js
  app.import('node_modules/highlightjs/highlight.pack.min.js');

  app.import('node_modules/highlightjs/styles/github-gist.css');
  app.import('node_modules/highlightjs/styles/hybrid.css');

  return app.toTree();
};
