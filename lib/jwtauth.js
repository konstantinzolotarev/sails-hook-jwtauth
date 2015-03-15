'use strict';

var jwt = require('jsonwebtoken');

module.exports = function(sails) {
  return {

    /**
     * Get model for fetching user
     *
     * @returns {*}
     */
    getModel: function() {
      var model = sails.models[sails.config.jwtauth.model]
      if (!model) {
        throw new Error('No model exist');
      }
      return model;
    },

    /**
     * Encode user to JWT token
     *
     * @param {User|Object} user
     * @param {function=} [cb]
     * @returns {*|Function}
     */
    encode: function(user, cb) {
      cb = cb || function() {};
      if (!user[sails.config.jwtauth.identifier]) {
        return cb(new Error('No identifier exist in user'));
      }
      var payload = {};
      payload[sails.config.jwtauth.identifier] = user[sails.config.jwtauth.identifier];

      var options = {
        algorithm: sails.config.jwtauth.algorithm || 'HS256'
      };
      if (sails.config.jwtauth.expiresInMinutes) {
        options.expiresInMinutes = sails.config.jwtauth.expiresInMinutes;
      }
      jwt.sign(payload, sails.config.jwtauth.secret, options, cb);
    },

    /**
     * Decode token and try to load User from DB.
     *
     * @param {string} token
     * @param {function=} [cb]
     */
    decode: function(token, cb) {
      cb = cb || function() {};

      jwt.verify(token, sails.config.jwtauth.secret, function(err, decoded) {
        if (err) {
          return cb(err);
        }
        if (!decoded[sails.config.jwtauth.identifier]) {
          return cb(new Error('No identifier exist'));
        }
        var model = this.getModel();

        var query = {};
        query[sails.config.jwtauth.identifier] = decoded[sails.config.jwtauth.identifier];
        model.findOne(query).exec(function(err, user) {
          if (err) {
            return cb(err);
          }
          if (!user) {
            return cb(new Error('No user exist'));
          }
          return cb(null, user);
        });
      });
    }

  };
};
