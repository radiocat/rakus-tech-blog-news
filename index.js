const express = require('express');
const bodyParser = require('body-parser');
const FeedParser = require('feedparser');
const util = require('util');
const http = require('http');
const moment = require("moment");

const BLOG_RSS_URL = 'http://tech-blog.rakus.co.jp/rss';

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('port', (process.env.PORT || 5000));

const server = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports.closeServer = function(){
  server.close();
};

const sendResponse = function(response, resultObject){
  response.setHeader("Content-Type", "application/json");
  response.send(JSON.stringify(resultObject));
};

module.exports.sendResponse = sendResponse;

// Google Assistant向けJSONを返す
app.post('/', function(request, response, next) {
  let feedMeta;
  let speechText = "最新のブログ情報をお知らせします。\n";
  let itemCount = 0;

  if (!request.body) {
    response.status(400).send(http.STATUS_CODES[400] + '\r\n');
    return ;
  }
  console.log('[REQUEST]', util.inspect(request.body,false,null));

  const hasScreen = (function (data) {
      if (data.surface && data.surface.capabilities) {
        for (let v of data.surface.capabilities) {
          if (v.name === 'actions.capability.SCREEN_OUTPUT'){
            console.log('ENABLE SCREEN_OUTPUT');
            return true;
          };
        };
      }
      return false;
  })(request.body.originalRequest.data);

  const createResultObject =  function (hasScreen, word, basicCard) {
      if (hasScreen) {
        return  {
          "speech": word,
          "data": {
            "google": {
              "expectUserResponse": false,
              "richResponse": {
                "items": [
                  {
                    "simpleResponse": {
                      "textToSpeech": word
                    }
                  },
                  basicCard
                ],
                "suggestions": []
              }
            },
            "possibleIntents": [
              {
                "intent": "actions.intent.TEXT"
              }
            ]
        }
      };
    }
    return {
      "speech": word , "displayText": word
    };
  };

  // RSSフィードを取得する
  http.get(BLOG_RSS_URL, function(res) {
    res.pipe(new FeedParser({}))
      .on('error', function(error) {
//        response.status(500).send(http.STATUS_CODES[500] + '\r\n');
        sendResponse(response, "最新情報を取得できませんでした。");
      })
      .on('meta', function(meta) {
        feedMeta = meta;
      })
      .on('readable', function() {
        let stream = this, item;

        // chunkデータを保存する
        while (item = stream.read()) {
          if (itemCount >= 5) {
            break;
          }

          speechText += moment(item.pubDate).format("M月D日");
          speechText += "投稿、\n";
          speechText += item.title + "\n\n";
          itemCount += 1;
        }
      })
      .on('end', function() {
        
        console.log(speechText);
        const basicCard = {
          "basicCard": {
            "title": feedMeta.title,
            "formattedText": feedMeta.description,
            "image": {
              "url": "https://cdn1.www.st-hatena.com/users/te/tech-rakus/profile.gif",
              "accessibilityText": feedMeta.title
            },
            "buttons": [
              {
                "title": "Read more",
                "openUrlAction": {
                  "url": feedMeta.link
                }
              }
            ]
          }
        };

        sendResponse(response, createResultObject(hasScreen, speechText, basicCard));
      });
  });

});

// Alexaのフラッシュブリーフィングフィード向けJSONを返す
app.get('/alexa/feed/json', function(request, response, next) {
  let feedData = [];
  let itemCount = 0;

  console.log('[REQUEST]', util.inspect(request.body,false,null));

  // RSSフィードを取得する
  http.get(BLOG_RSS_URL, function(res) {
    res.pipe(new FeedParser({}))
      .on('error', function(error) {
        response.status(500).send(http.STATUS_CODES[500] + '\r\n');
      })
      .on('meta', function(meta) {
        feedMeta = meta;
      })
      .on('readable', function() {
        let stream = this, item;

        while (item = stream.read()) {
          if (itemCount >= 5) {
            break;
          }

          feedData.push(
            {
              "uid": item.guid,
              "updateDate": item.pubDate,
              "titleText": item.title,
              "mainText": moment(item.pubDate).format("M月D日") + "投稿、" + item.title,
              "redirectionUrl": item.link
            }
          );

          itemCount += 1;
        }
      })
      .on('end', function() {
        console.log(feedData);
        sendResponse(response, feedData);
      });
  });

});

