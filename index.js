'use strict';

module.exports = function(app) {

  return {
    defaults: {

        jwtauth: {
          model: ''
        }
      },

      configure: function(app) {
        if (!app.config.jwtauth.model) {
          throw new Error('Please configure model.');
        }
      },

      initialize: function(app) {}
  };
};
