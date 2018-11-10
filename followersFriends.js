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

function queryTwitter(username) {
  client.get('followers/list', {user_id: username}, function(error, users, response) {
    if(error) {
      console.log(error);
    } else {
      console.log(users);
    }
  });
}

function queryFollowersFriends() {
  con.query('SELECT user FROM tweets', (err, rows) => {
    if(err) {
      console.log(err);
    } else {
      console.log('Data received from Db:\n');
      rows.forEach((row) => {
        console.log('username: '  + row.user);
        queryTwitter(row.user);
      });
    }
  });
}

queryFollowersFriends();
