function genGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

$(document).ready(function() {
    namespace = '/test';

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    socket.on('connect', function() {
        socket.emit('my_event', {data: 'I\'m connected!'});
    });

    socket.on('heartbeat', function(msg) {
        heatbeat_time = Date(msg.datetime)
        $('#heartbeat').text('Received #' + msg.count + ': ' + heatbeat_time);
    });

    socket.on('log', function(msg) {
        $('#log').append('<br>' + $('<div/>').text('Received ' + msg.type + ': ' + msg.data).html());
    });

    // Send queries
    $('#query_button').click(function(event) {
        queryCmd = $('#console_input').val()
        if (queryCmd) {
            hash = queryCmd.hashCode()
            guid = genGuid()
            query = {query: queryCmd, hash: hash, guid: guid}

            socket.emit('query_req', query);
            $('#console_input').val('')
            $('#query_log').prepend(`
                <tr class=${guid}_tr>
                    <td>${hash}</td>
                    <td>${queryCmd}</td>
                    <td id='${guid}_result''>?</td>
                    <td><button>Fav.</button></td> 
                </tr>
                `);

        } else { alert('No query to send!') }
    });

    // Handle query response
    socket.on('query_resp', function(msg) {
        hash = msg.hash
        guid = msg.guid
        code = msg.code
        result = msg.result
        $(`#${guid}_result`).text(result);
    });

    $('#config_button').click(function(event) {
        if ($('#console_input').val()) {
            if (confirm('Continue with config?')) {
                socket.emit('config', {data: $('#console_input').val()});
                $('#console_input').val('')
            }
        } else { alert('No config to send!') }
    });

    $("#submit_tree_button").click(function(event){
        if (confirm('Commit current tree?')) {
            var tree = $("#tree").fancytree("getTree");
            var tree_dict = tree.toDict(true);
            socket.emit('inventory', {data: tree_dict});
        }       
    });

    socket.on('inventory', function(msg) {
        alert('Inventory update: ' + msg.data)
    });
});