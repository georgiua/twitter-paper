var Twitter = require('twitter');
var fs = require('fs');
var config = require('./config.js');
var dbSettings = require('./dbSettings.js');
var sqlObjects = require('./sqlObjects.js');
var mysql = require('mysql');

// setting up the objects
var client = new Twitter(config);
var con = mysql.createConnection(dbSettings);
var topics = ['node.js', 'MAGAbomber', ''];

// db connect
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// function andri
function searchTwitter(topic, maxId) {
  const parameters = {
    q: topic,
    result_type:'recent',
    count: '100'
  };

  if(maxId) {
    parameters.max_id = maxId;
  }

  client.get('search/tweets', parameters, function(error, tweets, response) {
    if(error) throw error;
    var currentTweet = '';
    var currentUser = '';
    var currentUserId = '';
    tweets.forEach(function(status) {
      currentUser = status.user.screen_name;
      currentTweet = status.text;
      currentUserId = status.user.id;
      var sql = `INSERT INTO tweets (topic, tweet, user) VALUES ('${topic}','${currentTweet}','${currentUser}')`;
      con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 new record inserted");
      });
    });
    var maxId = tweets.max_id;
    searchTwitter(topic, maxId);
  }
}

// main loop to collect data
topics.forEach(function(topic) {
  searchTwitter(topic);
});

con.end();
