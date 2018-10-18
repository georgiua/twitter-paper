var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: '9XAMNsAYD5N2jRiLbqLr1eWX0',
  consumer_secret: 'QFfrnbBZRlLZnmtzlTKmJ0ms38Mdr1vtioQBfJ0E2zQ9eWHzez',
  access_token_key: '255730707-CthpNibcuo2FPJnT39hEVKJZeMXhD1pI1hdgehcT',
  access_token_secret: 'GtokFicAEZ29UALUyRpWRKZDgT6vmZma3tQVtMxFrKgec'
});

client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response) {
   console.log(tweets);
});
