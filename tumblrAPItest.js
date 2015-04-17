// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: '',
  consumer_secret: '',
  token: '',
  token_secret: ''
});

// // Make the request
// client.userInfo(function (err, data) {
//     // ...
// });

client.posts('jacobjzhang.tumblr.com', function(err, blog){
  console.log(blog);
})