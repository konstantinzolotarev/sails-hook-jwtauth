'use strict';

module.exports = function (app) {
  /**
   * List of hooks that required for adminpanel to work
   */
  var requiredHooks = [
    'blueprints',
    'controllers',
    'http',
    'orm',
    'policies',
  ];

  return {

    defaults: {
      jwtauth: {
        model: '',
        identifier: '_id',

        algorithm: 'HS256',
        secret: '',
        loginUrl: '/'
      }
    },

    initialize: function (cb) {
      try {
        var eventsToWaitFor = [];
        try {
          /**
           * Check hooks availability
           */
          _.forEach(requiredHooks, function (hook) {
            if (!app.hooks[hook]) {
              throw new Error('Cannot use `adminpanel` hook without the `' + hook + '` hook.');
            }
            //if (hook == 'policies') {
            //    eventsToWaitFor.push('hook:' + hook + ':bound');
            //} else {
            eventsToWaitFor.push('hook:' + hook + ':loaded');
            //}
          });
        } catch(err) {
          if (err) {
            return cb(err);
          }
        }
        if (!app.config.jwtauth.model) {
          throw new Error('Please configure model.');
        }
        if (!app.config.jwtauth.secret) {
          throw new Error('Please configure secret.');
        }
        app.jwtauth = require('./lib/jwtauth')(app);
        cb();
      } catch(err) {
        return cb(err);
      }
    }
  };
};
