var index = require('../index.js');
var assert = require('assert');
var request = require('superagent');
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
      request
        .get(host + '/')
        .end(function(err, res) {
          console.log('Get Error Tests');
          assert.deepEqual(res.status, 404);
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
      request
      .get(host + '/alexa/feed/json')
      .end(function(err, res) {
        assert(res.status === 200);
        done();
      });
    });

  });

  describe('/', function(){
    // Google Homeから呼び出された時のリクエスト
    const param = { "originalDetectIntentRequest":
      {
        //...省略
        "payload":
        { 
          // ...省略
          "surface": { "capabilities": [ 
            { "name": "actions.capability.AUDIO_OUTPUT" },
            { "name": "actions.capability.SCREEN_OUTPUT" }
            ] },
            // ...省略
        }
      }
    };
    
    it('正常レスポンスを返す', function(done) {
      request
      .post(host + '/')
      .set('Content-Type', 'application/json')
      .send(param)
      .end(function(err, res) {
        assert(res.status === 200);
        done();
      });
    });

  });

  after(function() {
    index.closeServer();
  });

});



