'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function () {
  return Promise.all([getChannelURL('release'), getChannelURL('beta')]).then((urls) => {
    return {
      useYarn: true,
      scenarios: [
        {
          name: 'ember-lts-3.8-and-ember-data-3.8',
          npm: {
            devDependencies: {
              'ember-source': '~3.8.3',
              'ember-data': '~3.8.1',
              'ember-decorators-polyfill': '1.1.5',
            },
          },
        },
        {
          name: 'ember-lts-3.16-and-ember-data-3.16',
          npm: {
            devDependencies: {
              'ember-source': '~3.16.10',
              'ember-data': '~3.16.9',
            },
          },
        },
        {
          name: 'ember-lts-3.20-and-ember-data-3.20',
          npm: {
            devDependencies: {
              'ember-source': '~3.20.7',
              'ember-data': '~3.20.5',
            },
          },
        },
        {
          name: 'ember-lts-3.24-and-ember-data-3.24',
          npm: {
            devDependencies: {
              'ember-source': '~3.24.3',
              'ember-data': '~3.24.2',
            },
          },
        },
        {
          name: 'ember-release',
          npm: {
            devDependencies: {
              'ember-source': urls[0],
            },
          },
        },
        {
          name: 'ember-beta',
          npm: {
            devDependencies: {
              'ember-source': urls[1],
            },
          },
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {},
          },
        },
        {
          name: 'ember-default-with-jquery',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': true,
            }),
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^0.5.1',
            },
          },
        },
      ],
    };
  });
};
