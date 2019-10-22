
# Rakus Tech Blog News

http://tech-blog.rakus.co.jp/ のRSSをAction on GoogleとAlexa向けのJsonにして返す処理を行う。  

参考 

- http://tech-blog.rakus.co.jp/entry/2018/02/05/130449
- http://tech-blog.rakus.co.jp/entry/2018/02/19/093421

## Build

``` sh
$ npm install
$ npm start
```

## Unit test

``` sh
$ npm test
```

# Memo

## Request Sample

Dialogflow v2 

``` Json
{
    "originalDetectIntentRequest": {
        "source": "google",
        "version": "2",
        "payload": {
            "isInSandbox": true,
            "surface": {
                "capabilities": [
                    {
                        "name": "actions.capability.SCREEN_OUTPUT"
                    }
                ]
            },
            "inputs": [
                1,
                2,
                3
            ],
            "user": {},
            "conversation": {},
            "availableSurfaces": [
                1,
                2,
                3
            ]
        }
    }
}
```

Dialogflow v1 (deprecated)

``` Json
{
    "originalRequest": {
        "source": "google",
        "version": "2",
        "data": {
            "isInSandbox": true,
            "surface": {
                "capabilities": [
                    {
                        "name": "actions.capability.SCREEN_OUTPUT"
                    }
                ]
            },
            "inputs": [
                1,
                2,
                3
            ],
            "user": {},
            "conversation": {},
            "availableSurfaces": [
                1,
                2,
                3
            ]
        }
    }
}
```






