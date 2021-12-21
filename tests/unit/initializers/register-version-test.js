import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import Application from '@ember/application';
import { initialize } from 'dummy/initializers/register-version';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

describe('Unit | Initializer | register-version', function() {
  beforeEach(function() {
    this.TestApplication = Application.extend();
    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize
    });

    this.application = startApp({ autoboot: false });
  });

  afterEach(function() {
    destroyApp(this.application);
  });

  // TODO: Replace this with your real tests.
  it('works', function() {
    this.application.boot().then(() => {

      // you would normally confirm the results of the initializer here
      expect(true).to.be.ok;
    });
  });
});
