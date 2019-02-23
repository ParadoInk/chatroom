var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')

let nicks = {

};

let typings = [];
let messages = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/chatroom.html');
});

io.on('connection', function(socket){
    let nick = "anon";
    let istyping = false;
    nicks["" + socket.id] = nick;
    console.log('a user has connected: ' + socket.id);
    io.emit('chat message', "a user has connected");
    updateonlinelist();
    for(let i = 0; i < messages.length; i++){
        socket.emit('chat message', messages[i]);
    }
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('chat message', nicks["" + socket.id] + " has disconnected");
        typeupdate(false);
        delete nicks["" + socket.id];
        updateonlinelist();

    });


    socket.on('chat message', function(msg){
        console.log(nicks);
        console.log('message: ' + msg + "\nfrom: " + socket.id);
        io.emit('chat message', nicks["" + socket.id] + ": " + msg);
        if(messages.length < 100){
            messages.push(nicks["" + socket.id] + ": " + msg);
        }
        else {
            messages.pop();
            messages.push(nicks["" + socket.id] + ": " + msg);
        }
    });

    socket.on('change nick', function(newnick){
        io.emit('chat message', nick + " has changed their name to " + newnick);
        nick = newnick;
        nicks["" + socket.id] = newnick;
        updateonlinelist();
        if(messages.length < 100){
            messages.push(nick + " has changed their name to " + newnick);
        }
        else {
            messages.pop();
            messages.push(nick + " has changed their name to " + newnick);
        }
    });

    function updateonlinelist(){
        io.emit('online list', nicks);
    }

    function typeupdate(typing){
        if(typing){
            typings.push(nicks["" + socket.id]);
        }
        else {
            for(let i = 0; i < typings.length; i++){
                if(typings[i] == nicks["" + socket.id]){
                    typings.splice(i, 1);
                    break;
                }
            }
        }
        console.log(typings);
        socket.broadcast.emit('typinglist', typings);
    }
    socket.on('typing', function(typing){typeupdate(typing);});

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});