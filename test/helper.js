'use strict';

var Sails = require('sails').Sails;
var _ = require('lodash');

module.exports = {

  sails: null,

  /**
   * Will lift sails app
   *
   * @param {function=} [cb]
   */
  lift: function (config, cb) {
    var self = this;
    if (_.isFunction(config)) {
      cb = config;
      config = {};
    }
    cb = cb || function() {};

    var configObject = _.merge({
      hooks: {
        // Load the hook
        "jwtauth": require('../'),
        // Skip grunt
        "grunt": false
      },
      log: {level: "silent"}
    }, config || {});

    Sails().lift(configObject, function(err, _sails) {
      self.sails = _sails;
      return cb(err, _sails);
    });
  },

  /**
   * Will stop running sails.js server
   *
   * @param {function=} [cb]
   */
  stop: function(cb) {
    cb = cb || function() {};
    if (this.sails) {
      this.sails.lower(cb);
    } else {
      cb();
    }
  }
};
