var express = require('express');

var server = express();

server.use(express.static('frontend'));

server.listen(process.env.PORT || 3000, function(){
   console.log('Example app listening on port 3000!');
});
