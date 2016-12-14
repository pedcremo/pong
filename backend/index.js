var express = require('express');
var app = express();

//var server = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); //Read tutorial on tutorialspoint.com


app.use(express.static('frontend'));

io.on('connection',function(socket){
    console.log("new user connected from "+socket.id);
    socket.on('stick id and position',function(msg){
        console.log('stick id and position=>'+msg);
        io.emit('stick id and position',msg);
    });
});

app.get('/template/:template_name',function(req,res){
        console.log("HOLAAAA "+__dirname);

        res.sendFile('templates/'+req.params.template_name+'.html', { root: __dirname });
        //res.sendFile(__dirname+'/../frontend/templates/modal-player-profile.html');
});

http.listen(process.env.PORT || 3000, function(){
   console.log('Example app listening on port 3000 open http://localhost:3000!');
});
