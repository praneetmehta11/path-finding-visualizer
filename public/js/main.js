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
        this.startPoint = {
            x: 5,
            y: 10
        }
        this.endPoint = {
            x: 5,
            y: 30
        }
    }
    validate(x, y) {
        return ((x >= 0 && x < this.numberOfRows) && (y >= 0 && y < this.numberOfColumns));
    }
}
var isMouseDown = false
var moveStart = false
var moveEnd = false
var lastStart = {
    x: 0,
    y: 0,
};
var lastEnd = {
    x: 0,
    y: 0,
};
var grid = [];

class Node {
    constructor(node) {
        this.node = node
        this.isWall = false
        this.visited = false
        this.start = false
        this.end = false
        this.x = parseInt(node.attr('x'))
        this.y = parseInt(node.attr('y'))
        this.configureNode();
        this.initEventListeners();
        if (this.x == config.startPoint.x && this.y == config.startPoint.y) {
            this.start = true;
            node.addClass('start');
        }
        if (this.x == config.endPoint.x && this.y == config.endPoint.y) {
            this.end = true;
            node.addClass('end');
        }
    }

    reset() {
        this.isWall = false
        this.visited = false
        this.start = false
        this.end = false
        this.node.removeClass()
    }

    reDraw() {
        this.node.removeClass()
        if (this.isWall) {
            this.node.addClass('wall')
        }
        if (this.end) {
            this.node.addClass('end')
        }
        if (this.start) {
            this.node.addClass('start')
        }
    }
    configureNode() {
        this.node.height(config.nodeHeight);
        this.node.width(config.nodewidth);
    }

    initEventListeners() {
        this.node.mousedown(() => {
            this.mousedown();
        })
        this.node.mouseup(() => {
            this.mouseup();
        })
        this.node.mouseenter(() => {
            this.mouseenter();
        })
        this.node.mouseout(() => {
            this.mouseout();
        })
    }
    mousedown(node) {
        isMouseDown = true;
        if (this.start) {
            moveStart = true;
            return;
        }
        if (this.end) {
            moveEnd = true;
            return;
        }
        if (!this.isWall) {
            this.isWall = true;
            this.addWall();
        } else {
            this.isWall = false;
            this.removeWall();
        }
    }

    mouseup(node) {
        if (moveStart) {
            if (this.end) {
                var oldX = lastStart.x;
                var oldY = lastStart.y;
                var oldNode = grid[oldX][oldY];
                oldNode.reset();
                oldNode.start = true;
                oldNode.reDraw();
                config.startPoint.x = oldX;
                config.startPoint.y = oldY;
            } else {
                this.start = true;
                config.startPoint.x = this.x;
                config.startPoint.y = this.y;
            }
            return;
        }

        if (moveEnd) {
            if (this.start) {
                var oldX = lastEnd.x;
                var oldY = lastEnd.y;
                var oldNode = grid[oldX][oldY];
                oldNode.reset();
                oldNode.end = true;
                oldNode.reDraw();
                config.startPoint.x = oldX;
                config.startPoint.y = oldY;
            } else {
                this.end = true;
                config.endPoint.x = this.x;
                config.endPoint.y = this.y;
            }
            return;
        }
        isMouseDown = false
        moveStart = false
        moveEnd = false
    }


    mouseenter(node) {
        if (this.start || this.end) return;
        if (isMouseDown) {
            if (moveStart) {
                var oldX = config.startPoint.x;
                var oldY = config.startPoint.y;
                var oldNode = grid[oldX][oldY];
                oldNode.reset();
                this.node.addClass('start');
                return;
            }
            if (moveEnd) {
                var oldX = config.endPoint.x;
                var oldY = config.endPoint.y;
                var oldNode = grid[oldX][oldY];
                oldNode.reset();
                this.node.addClass('end');
                return;
            }
            if (!this.isWall) {
                this.isWall = true;
                this.addWall();
            } else {
                this.isWall = false;
                this.removeWall();
            }
        }
    }
    mouseout() {
        if (moveStart && !this.end) {
            this.start = false
            lastStart.x = this.x;
            lastStart.y = this.y;
        }
        if (moveEnd && !this.start) {
            this.end = false
            lastEnd.x = this.x;
            lastEnd.y = this.y;
        }
        if (moveStart || moveEnd) this.reDraw();
    }
    addWall() {
        this.node.addClass('wall')
        this.node.addClass("scale-up-center");
    }
    removeWall() {
        this.node.removeClass('wall')
        this.node.removeClass("scale-up-center");
    }

    markVisited() {
        this.node.removeClass();
        this.node.addClass('visited')
        this.node.addClass("visited-animation");
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
    config.startPoint.x = Math.floor(config.numberOfRows * 0.50)
    config.endPoint.x = Math.floor(config.numberOfRows * 0.50)
    config.startPoint.y = Math.floor(config.numberOfColumns * 0.25)
    config.endPoint.y = Math.floor(config.numberOfColumns * 0.75)
    lastStart.x = config.startPoint.x;
    lastStart.y = config.startPoint.y;
    lastEnd.x = config.endPoint.x;
    lastEnd.y = config.endPoint.y;
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

function resetGrid() {
    for (let i = 0; i < config.numberOfRows; ++i) {
        for (let j = 0; j < config.numberOfColumns; ++j) {
            let node = grid[i][j];
            node.reset();
            if (node.x == config.startPoint.x && node.y == config.startPoint.y) {
                node.start = true;
            }
            if (node.x == config.endPoint.x && node.y == config.endPoint.y) {
                node.end = true;
            }
            node.reDraw()
        }
    }
}

$(function() {
    console.log(navigator.userAgent);
    gatherConfigDetails();
    init();
    console.log(config)
    $(document).mouseup(() => {
        isMouseDown = false
        moveStart = false
        moveEnd = false
        var oldX = config.endPoint.x;
        var oldY = config.endPoint.y;
        var oldNode = grid[oldX][oldY];
        oldNode.end = true
        oldNode.reDraw();
        oldX = config.startPoint.x;
        oldY = config.startPoint.y;
        oldNode = grid[oldX][oldY];
        oldNode.start = true
        oldNode.reDraw();
    })
});

function printConfig() {
    console.log(config);
}



function bfs() {
    let queue = [grid[config.startPoint.x][config.startPoint.y]]
    grid[config.startPoint.x][config.startPoint.y].visited = true
    let current, x, y, next
    let R = [1, 1, 1, 0, 0, 1, 1, 1]
    let C = [-1, 0, 1, -1, 1, -1, 0, 1]
    while (queue.length != 0) {
        current = queue.shift()
        if (current.x == config.endPoint.x && current.y == config.endPoint.y) {
            console.log("path mil gaya re baba");
            return;
        }
        for (let i = 0; i < 8; ++i) {
            x = current.x + R[i]
            y = current.y + C[i]
            if (config.validate(x, y)) {
                next = grid[x][y]
                if (!next.visited && !next.isWall && !next.start) {
                    next.visited = true
                    next.markVisited()
                    queue.push(next)
                }
            }
        }
    }
}