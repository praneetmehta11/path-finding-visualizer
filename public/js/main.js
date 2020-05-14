class Config {
    constructor() {
        this.windowHeight = 0;
        this.windowWidth = 0;
        this.headerHeigth = 0;
        this.gridContainerHeight = 0;
        this.gridContainerWidth = 0;
        this.gridHeight = 0;
        this.gridWidth = 0;
        this.nodeHeight = 30;
        this.nodewidth = 30;
        this.numberOfRows = 0;
        this.numberOfColumns = 0;
    }
}
var isMouseDown = false
var grid = [];

class Node {
    constructor(node) {
        this.node = node
        this.isWall = false
        this.isVisited = false
        this.source = false
        this.destination = false
        this.configureNode();
        this.initEventListeners();
    }

    reset() {
        this.isWall = false
        this.isVisited = false
        this.source = false
        this.destination = false
    }

    configureNode() {
        this.node.height(config.nodeHeight);
        this.node.width(config.nodewidth);
    }

    initEventListeners() {
        this.node.mousedown(() => {
            this.nodeMousedown();
        })
        this.node.mouseup(() => {
            this.nodeMouseup();
        })
        this.node.mouseenter(() => {
            this.nodeMouseenter();
        })

    }


    nodeMousedown(node) {
        isMouseDown = true;
        this.node.addClass('wall')
        this.node.addClass("scale-up-center");
    }

    nodeMouseup(node) {
        isMouseDown = false
    }

    nodeMouseenter(node) {
        if (isMouseDown) {
            this.node.addClass('wall')
            this.node.addClass("scale-up-center");
        }
    }


    animate() {

    }
}
var config = new Config();

function gatherConfigDetails() {
    config.windowHeight = $(window).height();
    config.windowWidth = $(window).width();
    config.headerHeigth = $(".card-header").height() + 20;
    config.gridContainerHeight = config.windowHeight - config.headerHeigth - 65;
    config.gridContainerWidth = $('#grid-container').width();
    config.gridHeight = config.gridContainerHeight - 20
    config.gridWidth = config.gridContainerWidth - 20
    config.numberOfRows = Math.floor(config.gridHeight / config.nodeHeight);
    config.numberOfColumns = Math.floor(config.gridWidth / config.nodewidth) - 1;
}

function init() {
    createGrid();
}


function createGrid() {
    $('#grid-container').height(config.gridContainerHeight)
    var table = $("#grid");
    for (let i = 0; i < config.numberOfRows; ++i) {
        var row = $('<tr>');
        var gridRow = []
        for (let j = 0; j < config.numberOfColumns; ++j) {
            var node = $(`<td>`)
            node.attr('x', i);
            node.attr('y', j);
            gridRow.push(new Node(node));
            row.append(node);
        }
        grid.push(gridRow);
        table.append(row);
    }
}

$(function() {
    console.log(navigator.userAgent);
    gatherConfigDetails();
    init();
});