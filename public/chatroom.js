

$(function () {
    var socket = io();
    $('#messagebox').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    $('#nickchanger').submit(function(e){
        e.preventDefault();
        socket.emit('change nick', $('#n').val());
        $('#n').val('');
        return false;
    })
    socket.on('chat message', function(msg){
        console.log($('#messagediv').scrollTop());
        console.log(document.getElementById('messagediv').scrollHeight - window.innerHeight * .9);
        console.log(document.getElementById('messagediv').scrollHeight);
        console.log(window.innerHeight * .9);
        let scroll = true;
        if(document.getElementById('messagediv').scrollHeight < window.innerHeight * .9){
            scroll = false;
        }
        let diff = Math.abs($('#messagediv').scrollTop() - (document.getElementById('messagediv').scrollHeight - window.innerHeight * .9));
        $('#messages').append($('<li>').text(msg));
        if(diff < 5){
            $('#messagediv').scrollTop($('#messagediv')[0].scrollHeight);
        }
        else if(!scroll && document.getElementById('messagediv').scrollHeight > window.innerHeight * .9){
            $('#messagediv').scrollTop($('#messagediv')[0].scrollHeight);
        }
    });
});

