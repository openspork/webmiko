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

// Blank node
      var newDevice = [
        { title: "device_name", folder: true,
          children: [
            { title: "$password=" },
            { title: "$user="},
            { title: "$ip="},
            { title: "$trunk=48" }
          ]}
      ];

$(document).ready(function() {
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

    $("#add_tree_node_button").click(function(event){
        //rootNode = $("#tree").fancytree("getRootNode");
        //rootNode.addChildren(newDevice);
        allAssetNode = $("#tree").fancytree('getNodeByKey','_1');
        allAssetNode.addChildren(newDevice);
    });






});