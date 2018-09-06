$(document).ready(function() {
    namespace = '/test';

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    socket.on('connect', function() {
        socket.emit('my_event', {data: 'I\'m connected!'});
    });

    socket.on('server_heartbeat', function(msg) {
        $('#log').append('<br>' + $('<div/>').text('Received #' + msg.count + ': ' + msg.data).html());
    });

    $('#query_button').click(function(event) {
        if ($('#console_input').val()) {
            socket.emit('query', {data: $('#console_input').val()});
            $('#console_input').val('')
        } else { alert('No config to send!') }
    });

    $('#config_button').click(function(event) {
        if ($('#console_input').val()) {
            if (confirm('Continue with config?')) {
                socket.emit('config', {data: $('#console_input').val()});
                $('#console_input').val('')
            }
        } else { alert('No config to send!') }
    });
    
});