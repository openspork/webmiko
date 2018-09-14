data = [
{title: "All Assets", folder: true, children: [
        {title: "sw1_24p", folder: true, children: [
            {title: "$password=P@ss1234"},
            {title: "$user=manager"},
            {title: "$ip=10.0.0.10"},
            {title: "$trunk1=1,24"},
        ]},
        {title: "sw2_48p", folder: true, children: [
            {title: "$password=P@ss1234"},
            {title: "$user=manager"},
            {title: "$ip=10.0.0.11"},
            {title: "$trunk=47-48"}
        ]},
    ]}
]

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
        query = $('#console_input').val()
        if (query) {
            hash = query.hashCode()

            socket.emit('query_req', {query: query, hash: hash});
            $('#console_input').val('')
            $('#query_log').prepend(`
                <tr class=${hash}_tr>
                    <td>${hash}</td>
                    <td>${query}</td>
                    <td id='${hash}_result''>?</td>
                    <td><button>Fav.</button></td> 
                </tr>
                `);

        } else { alert('No query to send!') }
    });

    // Handle query response
    socket.on('query_resp', function(msg) {
        hash = msg.hash
        code = msg.code
        result = msg.result
        $(`#${hash}_result`).text(result);
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

    $("#tree").fancytree({
        minExpandLevel: 2,
        checkbox: true,
        source: data,
        extensions: ["edit"],
        edit: {
        // Available options with their default:
        adjustWidthOfs: 4,   // null: don't adjust input size to content
        inputCss: { minWidth: "3em" },
        triggerStart: ["clickActive", "f2", "dblclick", "shift+click", "mac+enter"],
        beforeEdit: $.noop,   // Return false to prevent edit mode
        edit: $.noop,         // Editor was opened (available as data.input)
        beforeClose: $.noop,  // Return false to prevent cancel/save (data.input is available)
        save: $.noop,         // Save data.input.val() or return false to keep editor open
        close: $.noop,        // Editor was removed
    },
    select: function(event, data) {
        var node = data.node;
        selected = node.isSelected(); // Get the selected state of the selected node
            node.visit(function(childNode) {
                childNode.setSelected(selected); // apply the selected state to all children
            });
    }
    });
});