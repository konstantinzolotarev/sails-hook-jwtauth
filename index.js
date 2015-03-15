'use strict';

module.exports = function (app) {
  return {

    defaults: {
      jwtauth: {
        model: '',
        identifier: '_id',
        secret: '',
        loginUrl: '/'
      }
    },

    initialize: function (cb) {
      try {
        if (!app.config.jwtauth.model) {
          throw new Error('Please configure model.');
        }
        if (!app.config.jwtauth.secret) {
          throw new Error('Please configure secret.');
        }
        cb();
      } catch(err) {
        return cb(err);
      }
    }
  };
};
