import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('usage');
  this.route('validators', function() {
    this.route('presence');
    this.route('acceptance');
    this.route('absence');
  });
});

export default Router;
