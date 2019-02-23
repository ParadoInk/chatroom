var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')

let nicks = {

}

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/chatroom.html');
});

io.on('connection', function(socket){
    let nick = "anon"
    nicks["" + socket.id] = nick;
    console.log('a user has connected: ' + socket.id);
    io.emit('chat message', "a user has connected");
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('chat message', "a user has disconnected");
        delete nicks["" + socket.id];
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg + "\nfrom: " + socket.id);
        io.emit('chat message', nicks["" + socket.id] + ": " + msg);
    });

    socket.on('change nick', function(newnick){
        io.emit('chat message', nick + " has changed their name to " + newnick)
        nick = newnick;
        nicks["" + socket.id] = newnick;
    })

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});