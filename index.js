'use strict';

module.exports = function (app) {
  return {

    defaults: {
      jwtauth: {
        model: '',
        identifier: '_id'
      }
    },

    initialize: function (cb) {
      try {
        if (!app.config.jwtauth.model) {
          throw new Error('Please configure model.');
        }
        cb();
      } catch(err) {
        return cb(err);
      }
    }
  };
};
