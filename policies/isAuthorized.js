'use strict';

var jwt = require('jsonwebtoken');

/**
 * Policy for check JWT auth and load user
 *
 * @param {} req
 * @param res
 * @param next
 */
module.exports = function(req, res, next) {
  /**
   * Send forbidden to response
   * @returns {*}
   */
  var forbidden = function() {
    if (req.xhr || req.wantsJSON) {
      return res.forbidden('You are not permitted to perform this action.');
    } else {
      return res.redirect('/auth/login');
    }
  }

  var token = req.param('access_token') || (req.headers && req.headers['x-access-token']) || (req.cookies || req.cookies.access_token);
  if (!token) {
    return forbidden();
  }

  sails.jwt.verify(token, function(err, decoded) {
    if (err) {
      return forbidden();
    }
    //check decoded
  });
};