'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function () {
  return Promise.all([getChannelURL('release'), getChannelURL('beta')]).then((urls) => {
    return {
      useYarn: true,
      scenarios: [
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
          name: 'ember-lts-3.25-and-ember-data-3.25',
          npm: {
            devDependencies: {
              'ember-source': '~3.25.4',
              'ember-data': '~3.25.0',
            },
          },
        },
        {
          name: 'ember-lts-3.27-and-ember-data-3.27',
          npm: {
            devDependencies: {
              'ember-source': '~3.27.5',
              'ember-data': '~3.27.1',
            },
          },
        },
        {
          name: 'ember-lts-3.28-and-ember-data-3.28',
          npm: {
            devDependencies: {
              'ember-source': '~3.28.8',
              'ember-data': '~3.28.7',
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
