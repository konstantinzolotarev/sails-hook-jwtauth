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
      var model = sails.models[sails.config.jwtauth.model.toLowerCase()];
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
      var token = jwt.sign(payload, sails.config.jwtauth.secret, options);
      return cb(null, token);
    },

    /**
     * Decode token and try to load User from DB.
     *
     * @param {string} token
     * @param {function=} [cb]
     */
    decode: function(token, cb) {
      cb = cb || function() {};
      var self = this;
      jwt.verify(token, sails.config.jwtauth.secret, function(err, decoded) {
        if (err) {
          return cb(err);
        }
        if (!decoded[sails.config.jwtauth.identifier]) {
          return cb(new Error('No identifier exist'));
        }
        var model = self.getModel();

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
    },

    /**
     * Login given user
     *
     * @param {User} user User that shuold be authorized
     * @param {Response} res `sails.res` where auth_token cookie will be set
     * @param {function=} [cb]
     */
    login: function(user, res, cb) {
      var self = this;
      cb = cb || function() {};

      self.encode(user, function(err, token) {
        if (err) {
          return cb(err);
        }
        res.cookie(sails.config.jwtauth.tokenField, token);
        return cb(null, token);
      });
    }

  };
};
