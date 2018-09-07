data = [
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
    ]

$(document).ready(function() {
    namespace = '/test';

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    socket.on('connect', function() {
        socket.emit('my_event', {data: 'I\'m connected!'});
    });

    socket.on('heartbeat', function(msg) {
        $('#heartbeat').text('Received #' + msg.count + ': ' + msg.data);
    });

    socket.on('log', function(msg) {
        $('#log').append('<br>' + $('<div/>').text('Received ' + msg.type + ': ' + msg.data).html());
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

    $("#submit_tree_button").click(function(event){
        if (confirm('Commit current tree?')) {
            var tree = $("#tree").fancytree("getTree");
            var tree_dict = tree.toDict(true);
            socket.emit('inventory', {data: tree_dict})
        }       
    });

    socket.on('inventory', function(msg) {
        alert('Inventory update: ' + msg.data)
    });

    $("#tree").fancytree({
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
        }
    });



});