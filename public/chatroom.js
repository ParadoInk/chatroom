$(function () {
    let typing = false;
    let nick = "anon";
    var socket = io();
    $('#messagebox').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    $('#nickchanger').submit(function(e){
        nick = document.getElementById('n').value;
        e.preventDefault();
        socket.emit('change nick', $('#n').val());
        $('#n').val('');
        return false;
    });
    socket.on('online list', function(list){
        document.getElementById('online').innerHTML = "";
       for(var thing in list){
           $('#online').append($('<li>').text(list[thing]));
       }
    });
    socket.on('chat message', function(msg){
        let scroll = true;
        let diff = Math.abs($('#messagediv').scrollTop() - (document.getElementById('messagediv').scrollHeight - window.innerHeight * .85));
        if(document.getElementById('messagediv').scrollHeight < window.innerHeight * .85){
            scroll = false;
        }
        $('#messages').append($('<li>').text(msg));
        console.log(diff);
        if(diff < 5){
            $('#messagediv').scrollTop($('#messagediv')[0].scrollHeight);
        }
        else if(!scroll && document.getElementById('messagediv').scrollHeight > window.innerHeight * .85){
            $('#messagediv').scrollTop($('#messagediv')[0].scrollHeight);
        }
    });
    socket.on('typinglist', function(list){
        let ourlist = list;
        if(typing){
            for(let i = 0; i < list.length; i++){
                if(list[i] == nick){
                    ourlist.splice(i, 1);
                }
                break;
            }
        }
        document.getElementById('typing').innerHTML = "";
        for(let i = 0; i < ourlist.length - 1; i++){
            document.getElementById('typing').innerHTML += ourlist[i] + ", "
        }
        if(ourlist.length > 1){
            document.getElementById('typing').innerHTML += " and " + ourlist[ourlist.length - 1] + " are typing.";
        }
        else if(ourlist.length == 1){
            document.getElementById('typing').innerHTML = ourlist[0] + " is typing.";
        }

    });

    function sendtyping(){
        socket.emit('typing', typing);
    }

    function update(){
        if(document.getElementById('m').value != "" && typing == false){
            typing = true;
            sendtyping();
        }
        else if(document.getElementById('m').value == "" && typing == true){
            typing = false;
            sendtyping();
        }
    }

    setInterval(function(){ update(); }, 50);

});

