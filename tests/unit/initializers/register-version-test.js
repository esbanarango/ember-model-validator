import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import Application from '@ember/application';
import { initialize } from 'dummy/initializers/register-version';
import destroyApp from '../../helpers/destroy-app';

describe('Unit | Initializer | register-version', function() {
  beforeEach(function() {
    this.TestApplication = Application.extend();
    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize
    });

    this.application = this.TestApplication.create({ autoboot: false });
  });

  afterEach(function() {
    destroyApp(this.application);
  });

  // TODO: Replace this with your real tests.
  it('works', async function() {
    await this.application.boot();

    // you would normally confirm the results of the initializer here
    expect(true).to.be.ok;
  });
});
