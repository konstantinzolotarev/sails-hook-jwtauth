'use strict';

var helper = require('../helper');

var should = require('should');

describe('Test', function() {

  var sails;

  //afterEach(function(done) {
  //  helper.stop(done);
  //});

  it('should fail without config', function(done) {
    helper.lift(function(err, _sails) {
      should.exist(err);
      err.message.should.be.eql('Please configure model.');
      done();
    });
  });

  it('should not fail with model configured', function(done) {
    var config = {
      jwtauth: {model: 'User'}
    };
    helper.lift(config, function(err, _sails) {
      should.not.exist(err);
      should.exist(_sails);
      done();
    });
  });
});
