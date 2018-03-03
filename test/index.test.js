var index = require('../index.js');
var assert = require('assert');
var request = require('supertest');
var host = 'http://localhost:5000';

describe('Test of Test', function(){
  it('Hello mocha', function(){
    var msg = 'mocha';
    assert.equal('Hello ' + msg, 'Hello mocha');
  });
});

describe('Server Test', function(){
  describe('/', function(){
    it('Get Access Error', function(){
      var status = 400;
      request(host)
        .get('/')
        .expect(status, '', function(err) {
           console.log('Get Error Tests');
           done(err);
        });
    });
  });

  after(function() {
    index.closeServer();
  });

});



