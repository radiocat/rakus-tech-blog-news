var index = require('../index.js');
var assert = require('assert');
var request = require('supertest');
var sinon = require('sinon');
var host = 'http://localhost:5000';

describe('Test of Test', function(){
  it('Hello mocha', function(){
    var msg = 'mocha';
    assert.equal('Hello ' + msg, 'Hello mocha');
  });
});

describe('Server Test', function(){

  describe('/', function(done){
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

  describe('sendResponse()', function(){

    var res;

    beforeEach(function() { 
      // mock
      res = {
        setHeader: function () { },
        send : function () { }
      };

    });

    it('responseが呼ぶメソッドをspy', function() {
      const spySetHeader = sinon.spy(res, 'setHeader');
      const spySend = sinon.spy(res, 'send');
      index.sendResponse(res, []);
      
      assert(spySetHeader.callCount === 1);
      assert(spySetHeader.getCall(0).args[0] === "Content-Type");
      assert(spySetHeader.getCall(0).args[1] === "application/json");
      assert(spySend.callCount === 1);
      assert(spySend.getCall(0).args[0] === JSON.stringify([]));

    });

  });

  describe('/alexa/feed/json', function(){

    it('正常レスポンスを返す', function(done) {
      request(host)
      .get('/alexa/feed/json')
      .expect(200, done);

    });

  });


  after(function() {
    index.closeServer();
  });

});



