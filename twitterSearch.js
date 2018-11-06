var Twitter = require('twitter');
var fs = require('fs');
var config = require('./config.js');
var dbSettings = require('./dbSettings.js');
var sqlObjects = require('./sqlObjects.js');
var mysql = require('mysql');
const CronJob = require('cron').CronJob;
const querystring = require('querystring');

// setting up the objects
var client = new Twitter(config);
var con = mysql.createConnection(dbSettings);
var topics = ['node.js', 'MAGAbomber', 'WorldSeries18'];
var maxIds = {
  'node.js': 0,
  'MAGAbomber': 0,
  'WorldSeries18': 0,
}

// function andri
function searchTwitter(topic, maxId) {
  console.log("in searchTwitter");
  const parameters = {
    q: topic,
    result_type:'recent',
    count: '30'
  };
  var counter = 1;

  if(maxIds[topic] != 0) {
    parameters.max_id = maxIds[topic];
  }
  console.log('Parameters' + parameters);

  client.get('search/tweets', parameters, function(error, tweets, response) {
    if(error) {
        console.log(error);
    } else {
      var currentTweet = '';
      var currentUser = '';
      var currentUserId = '';
      tweets.statuses.forEach(function(status) {
        currentUser = status.user.screen_name;
        currentTweet = status.text;
        currentUserId = status.user.id;
        var sql = `INSERT INTO tweets (topic, tweet, user) VALUES ('${topic}','${currentTweet}','${currentUser}')`;
        con.query(sql, function(err, result) {
          if (err) console.log(err);
          console.log("1 new record inserted");
        });
      });
    }
    var next_results = querystring.parse(tweets.search_metadata.next_results);
    maxIds[topic] = next_results.max_id;
    counter++;
    if(counter <= 2) {
        searchTwitter(topic, maxId);
    }
  });
}

// schedule the job
const job = new CronJob('*/15 * * * *', function() {

  // main loop to collect data
  topics.forEach(function(topic) {
    searchTwitter(topic);
  });
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  job.start();
});
