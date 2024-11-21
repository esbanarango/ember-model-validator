import Application from 'dummy/app';
import QUnit from 'qunit';
import config from 'dummy/config/environment';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
