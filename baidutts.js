#! /usr/bin/env node

var https = require('https');
var http = require('http');
var lame = require('lame');
var Speaker = require('speaker');
var decoder = new lame.Decoder();
var stream = require('stream');
var exec = require('child_process').exec;

var client_id = 'XXXXXXXXXXXXXXXXXXXXXXXXXXClient ID Here';
var client_secret = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXClient Secret Here';
var cuid = "aaaaaaaa";
var getClipboard = function(func) {
  exec('/usr/bin/xclip -o -selection clipboard', function(err, stdout, stderr) {
    if (err || stderr) return func(err || new Error(stderr));
    func(null, stdout);
  });
};

getClipboard(function(err, text) {
  if (err) throw err;
  console.log(text);
  var tex = encodeURIComponent(text);
  var lan = "zh";
  var url = `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}&`;
  https.get(url, function(res){
    data = '';
    res.on('data', function(trunk) {
      data += trunk;
      console.log("token: ", data);
    });
    res.on('end', function(trunk) {
      var json = JSON.parse(data);
      var tok = json['access_token'];
      var soundUrl = `http://tsn.baidu.com/text2audio?tex=${tex}&lan=${lan}&cuid=${cuid}&ctp=1&tok=${tok}`
      console.log("url: ", soundUrl);
      http.get(soundUrl, function(res) {
        var voice = '';
        res.pipe(decoder).pipe(new Speaker());
      });
    })
  });
});


