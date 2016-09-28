//dependencies
var express = require("express");
var request = require('superagent');

var logFactory = require('./helpers/log.js');
var log = logFactory.create("app");

var app = exports.app = express();

var secureImageSearch = function(q, hash, callback){

  var extraArgs = "&l=wt-wt&o=json&vqd="+hash+"&f=";
  var url = "https://duckduckgo.com/i.js?&q=" + q+ extraArgs;

  log.info("Searching "+url);

   request
     .get( url )
     .buffer(true)
     .end(function(err, res ){
        if (err || !res) {
          log.error("Error response from DDG "+ err);
         callback(err);
        } else {
          try{
            //log.info("DDG image response" + JSON.stringify(res) ) ;
            var json = JSON.parse(res.text);
            if (json.results){
              callback(undefined, json.results);
            } else {
              callback("Unable to get images from DDG: no results");
            }
        } catch (e){
          var msg = "Unable to get images from DDG: "+e;
          log.error(msg, e);
          callback(msg);
        }
      }
  });
};

var imageSearch = function(q, callback ) {

  //Make normal request to ddg to get the hash
  //This method is not docummented and it's very likely to change, so
  //keep that in mind if something suddenly fails
  request
    .get("https://duckduckgo.com/?q="+q+"&t=vivaldi&iax=1&ia=images")
    .end(function(err, res ){
      var body = res.text;
      //We need to filter the key on the code `vqd='327358238202064368347621428791274365820';`
      var hash = body.substr(body.indexOf('vqd=')+5).split("'")[0];

      secureImageSearch(q, hash, callback);
  });
};

app.get('/',function(req, res){
  res.json({
    'image': '/image?q=coconauts+net',
    'image url': '/image?q=coconauts+net&format=json',
    'gif': '/gif?q=nian+cat',
    'gif url': '/gif?q=nyan+cat&format=json'
  });
});

app.get('/image',function(req, res){
  imageSearch(req.query.q, function(error, results) {
    if (error) {
      log.error("ERROR: "+ error);
      res.status(400).json({error: error});
      return;
    }
    var image = results[0].image;
    log.info("Got image: " + image);
    if (req.query.format == "json") res.json({url: results[0].image});
    else res.redirect(image);
  });
});

app.get('/gif',function(req, res){
    imageSearch("gif " +req.query.q, function(error, results) {
      if (error) {
        log.error("ERROR: "+ error);
        res.status(400).json({error: error});
        return;
      }
      for (var result in results){
          var image = results[result].image;
          if (image.indexOf(".gif") > -1) {
              if (req.query.format == "json") res.json({url: image});
              else res.redirect(image);
              return;
        }
      }
      res.status(404).json({error:"Unable to find a gif from DDG"});
    });
});

var port = 8030;
app.listen(port);
log.info("Server started in http://localhost:"+port);
