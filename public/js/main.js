class Config {
    constructor() {
        this.windowHeight = 0;
        this.windowWidth = 0;
        this.headerHeigth = 0;
        this.gridContainerHeight = 0;
        this.gridContainerWidth = 0;
        this.gridHeight = 0;
        this.gridWidth = 0;
        this.nodeHeight = 27;
        this.nodewidth = 27;
        this.numberOfRows = 0;
        this.numberOfColumns = 0;
        this.minWeight = 1
        this.maxWeight = 10
        this.startPoint = {
            x: 5,
            y: 10
        }
        this.endPoint = {
            x: 5,
            y: 13
        }
        this.wallAnimationSpeed = 3
        this.visitedAnimationSpeed = 6
        this.pathAnimationSpeed = 60
    }
}
class Node {
    constructor(node) {
        this.node = node
        this.x = parseInt(node.attr('x'))
        this.y = parseInt(node.attr('y'))
        if (this.x == config.startPoint.x && this.y == config.startPoint.y) {
            this.start = true;
            node.addClass('start');
        }
        if (this.x == config.endPoint.x && this.y == config.endPoint.y) {
            this.end = true;
            node.addClass('end');
        }
        this.isWall = false
        this.visited = false
        this.previous = null;
        this.weight = 1;
        this.distance = Infinity
        this.configureNode();
        this.initEventListeners();
    }

    reset() {
        this.isWall = false
        this.start = false
        this.end = false
        this.previous = null;
        this.visited = false
            // this.weight = 1;
        this.distance = Infinity
        this.node.removeClass()
    }

    resetForMove() {
        this.visited = false
        this.previous = null
            // this.weight = 1;
        this.distance = Infinity
        this.node.removeClass()
        this.reDraw()
    }

    setRandomWeight() {
        this.weight = Math.floor(Math.random() * (config.maxWeight - config.minWeight) + config.minWeight)
        if (this.start || this.end) return
        this.node.html(this.weight);
    }

    removeWeight() {
        this.weight = 1;
        if (this.start || this.end) return
        this.node.html('');
    }


    reDraw(val) {
        this.node.removeClass()
        if (this.end) {
            if (isSolved) {
                this.node.addClass('path')
            }
            this.node.addClass('end')
            this.node.html('')
            return
        }
        if (this.start) {
            if (isSolved) {
                this.node.addClass('path')
            }
            this.node.html('')
            this.node.addClass('start')
            return
        }
        if (this.isWall) {
            this.node.html('')
            this.node.addClass('wall')
            return
        } else {
            if (isSolved && this.visited) {
                // this.node.addClass('visited')
            }
            if (val) {
                this.node.html("")
            } else {
                if (isWeighted)
                    this.node.html(this.weight)
            }
        }
    }

    configureNode() {
        this.node.height(config.nodeHeight);
        this.node.width(config.nodewidth);
    }

    initEventListeners() {
        this.node.mousedown(() => {
            if (Animator.isRunning) return
            this.mousedown();
        })
        this.node.mouseup(() => {
            if (Animator.isRunning) return
            this.mouseup();
        })
        this.node.mouseenter(() => {
            if (Animator.isRunning) return
            this.mouseenter();
        })
        this.node.mouseout(() => {
            if (Animator.isRunning) return
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
        if (!this.isWall || this.visited) {
            this.resetForMove()
            this.isWall = true;
            this.addWall();
        } else {
            this.resetForMove()
            this.isWall = false;
            this.removeWall();
        }
    }

    mouseup(node) {
        if (isMouseDown) {
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
                    this.start = false
                } else {
                    this.start = true;
                    config.startPoint.x = this.x;
                    config.startPoint.y = this.y;
                    // lastStart.x = this.x
                    //lastStart.y = this.y
                }
                afterMove()
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
                    config.endPoint.x = oldX;
                    config.endPoint.y = oldY;
                } else {
                    this.end = true;
                    config.endPoint.x = this.x;
                    config.endPoint.y = this.y;
                }
                afterMove()
                return;
            }
        }
        isMouseDown = false
        moveStart = false
        moveEnd = false
    }

    mouseenter(node) {
        if (this.start || this.end) {
            return
        }
        if (isMouseDown) {
            if (moveStart) {
                var oldX = config.startPoint.x;
                var oldY = config.startPoint.y;
                var oldNode = grid[oldX][oldY];
                oldNode.reset();
                solveMaze({ x: this.x, y: this.y }, config.endPoint)
                this.node.removeClass()
                if (isSolved) {
                    this.node.addClass("path")
                }
                this.node.addClass('start');
                this.node.html("")
                return;
            }
            if (moveEnd) {
                var oldX = config.endPoint.x;
                var oldY = config.endPoint.y;
                var oldNode = grid[oldX][oldY];
                oldNode.reset();
                solveMaze(config.startPoint, { x: this.x, y: this.y })
                this.node.removeClass()
                if (isSolved) {
                    this.node.addClass("path")
                }
                this.node.addClass('end');
                this.node.html("")
                return;
            }
            if (!this.isWall) {
                this.resetForMove()
                this.isWall = true;
                this.addWall();
            } else {
                this.resetForMove()
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
        if (this.start || this.end) return
        this.node.removeClass()
        this.node.addClass('wall')
        if (!Animator.isRunning)
            this.node.addClass('scale-up-center')

    }

    removeWall() {
        if (this.start || this.end) return
        if (isWeighted) this.node.html(this.weight)
        this.node.removeClass()
    }

    markVisited() {
        this.node.removeClass();
        if (this.start) {
            this.node.addClass('start')
        }
        if (this.end)
            this.node.addClass('end')
        this.node.addClass('visited')
    }

    highlightPath() {
        this.node.removeClass();
        this.node.addClass('path')
        if (this.start)
            this.node.addClass('start')
        if (this.end)
            this.node.addClass('end')
    }
}

class Animator {
    static isRunning = false
    constructor() {
        this.queue = []
    }
    push(node) {
        this.queue.push(node)
    }
    start() {
        Animator.isRunning = true;
        disable()
    }
    end() {
        Animator.isRunning = false;
        enable()
        this.queue = []
    }
    static stopAllAnimation() {
        Animator.isRunning = false;
    }
    drawWalls() {
        this.queue.forEach((node, i) => {
            node.addWall();
        })
        this.queue = []
    }
    animateWalls(speed) {
        this.start();
        var promises = []
        this.queue.forEach((node, i) => {
            let promise = new Promise((res, rej) => {
                setTimeout(() => {
                    if (!Animator.isRunning) return
                    node.addWall();
                    node.node.addClass("scale-up-center");
                    res();
                }, speed * i);
            })
            promises.push(promise)
        })
        Promise.all(promises).then(() => {
            this.end();
        })
    }
    drawVisited() {
        this.queue.forEach((node, i) => {
            node.markVisited();
        })
        this.queue = []
    }
    animateVisited(speed) {
        this.start()
        var promises = []
        this.queue.forEach((node, i) => {
            let promise = new Promise((res, rej) => {
                setTimeout(() => {
                    node.markVisited()
                    node.node.addClass("visited-animation");
                    res();
                }, speed * i);
            })
            promises.push(promise)
        });
        this.queue = []
        return new Promise((res, rej) => {
            Promise.all(promises).then(() => {
                this.end();
                res()
            })
        })
    }
    drawPath() {
        this.queue.forEach((node, i) => {
            node.highlightPath();
        })
        this.queue = []
    }
    animatePath(speed) {
        this.start();
        var promises = []
        this.queue.forEach((node, i) => {
            let promise = new Promise((res, rej) => {
                setTimeout(() => {
                    if (!Animator.isRunning) return
                    node.highlightPath()
                    node.node.addClass("path-animation");
                    res();
                }, speed * i);
            })
            promises.push(promise)
        })
        Promise.all(promises).then(() => {
            this.end();
        })
        this.queue.forEach((node, i) => {
            setTimeout(() => {

            }, speed * i);
        })
        this.queue = []
    }
}

class Algorithm {
    constructor(grid) {
        this.grid = grid
        this.height = config.numberOfRows;
        this.width = config.numberOfColumns
    }

    init() {
        this.height = config.numberOfRows;
        this.width = config.numberOfColumns
    }

    isValid(x, y) {
        return ((x >= 0 && x < this.height) && (y >= 0 && y < this.width));
    }

    bfs(startPoint, endPoint) {
        let src = this.grid[startPoint.x][startPoint.y]
        let dest = this.grid[endPoint.x][endPoint.y]
        let queue = [src]
        let current, x, y, next
        let R = [-1, 0, 1, 0];
        let C = [0, -1, 0, 1];
        var seachAnimator = new Animator();
        while (queue.length != 0) {
            current = queue.shift()
            if (current.visited) continue;
            current.visited = true
            if (current.x == dest.x && current.y == dest.y) {
                break;
            }
            seachAnimator.push(current);
            for (let i = 0; i < 4; ++i) {
                x = current.x + R[i]
                y = current.y + C[i]
                if (this.isValid(x, y)) {
                    next = this.grid[x][y]
                    if (!next.visited && !next.isWall && !(next.x == src.x && next.y == src.y)) {
                        next.previous = current;
                        queue.push(next)
                    }
                }
            }
        }
        let path = [dest]
        let node
        let pathAnimator = new Animator();
        if (dest.visited) {
            node = dest.previous;
            while (node.previous) {
                path.push(node);
                node = node.previous;
            }
            path.push(src)
            path.reverse();
            path.forEach((node) => {
                pathAnimator.push(node);
            })
        }
        return [seachAnimator, pathAnimator]
    }

    dfsHelper(src, dest, animator) {
        src.visited = true
        if (src.x == dest.x && src.y == dest.y) {
            return
        }
        animator.push(src)
        let R = [-1, 0, 1, 0];
        let C = [0, -1, 0, 1];
        let x, y, next
        for (let i = 0; i < 4; ++i) {
            x = src.x + R[i]
            y = src.y + C[i]
            if (this.isValid(x, y)) {
                next = this.grid[x][y]
                if (!next.visited && !next.isWall && !dest.visited && !(next.x == src.x && next.y == src.y)) {
                    next.previous = src;
                    this.dfsHelper(next, dest, animator);
                }
            }
        }
    }

    dfs(startPoint, endPoint) {
        let src = this.grid[startPoint.x][startPoint.y]
        let dest = this.grid[endPoint.x][endPoint.y]
        var seachAnimator = new Animator();
        this.dfsHelper(src, dest, seachAnimator);
        let path = [dest]
        let node
        let pathAnimator = new Animator();
        if (dest.visited) {
            node = dest.previous;
            while (node.previous) {
                path.push(node);
                node = node.previous;
            }
            path.push(src)
            path.reverse();
            path.forEach((node) => {
                pathAnimator.push(node);
            })
        }
        return [seachAnimator, pathAnimator]
    }

    dijkstra(startPoint, endPoint) {
        let src = this.grid[startPoint.x][startPoint.y]
        let dest = this.grid[endPoint.x][endPoint.y]
        var seachAnimator = new Animator();
        let queue = new PriorityQueue((a, b) => a.weight < b.weight)
        src.distance = 0
        queue.push({
            weight: 0,
            node: src
        })
        let R = [-1, 0, 1, 0];
        let C = [0, -1, 0, 1];
        let current, x, y, next, newWeight
        while (!queue.isEmpty()) {
            current = queue.pop()
            if (current.node.visited) continue
            current.node.visited = true
            seachAnimator.push(current.node);
            if (current.node.x == dest.x && current.node.y == dest.y) break
            for (let i = 0; i < 4; ++i) {
                x = current.node.x + R[i]
                y = current.node.y + C[i]
                if (this.isValid(x, y)) {
                    next = this.grid[x][y]
                    if (!next.visited && !next.isWall) {
                        newWeight = (current.node.distance + next.weight)
                        if (next.distance > newWeight) {
                            next.previous = current.node;
                            next.distance = newWeight;
                            queue.push({
                                weight: newWeight,
                                node: next
                            })
                        }
                    }
                }
            }
        }
        let path = [dest]
        let node
        let pathAnimator = new Animator();
        if (dest.visited) {
            node = dest.previous;
            while (node.previous) {
                path.push(node);
                node = node.previous;
            }
            path.push(src)
            path.reverse();
            path.forEach((node) => {
                pathAnimator.push(node);
            })
        }
        return [seachAnimator, pathAnimator]
    }

    bestFirstSearch(src, dest, heuristics) {
        var seachAnimator = new Animator();
        let queue = new PriorityQueue((a, b) => a.weight < b.weight)
        src.distance = 0
        queue.push({
            weight: heuristics(src, src, dest),
            node: src
        })
        let R = [-1, 0, 1, 0];
        let C = [0, -1, 0, 1];
        let current, x, y, next
        while (!queue.isEmpty()) {
            current = queue.pop()
            if (current.node.visited) continue
            current.node.visited = true
            seachAnimator.push(current.node);
            if (current.node.x == dest.x && current.node.y == dest.y) break
            for (let i = 0; i < 4; ++i) {
                x = current.node.x + R[i]
                y = current.node.y + C[i]
                if (this.isValid(x, y)) {
                    next = this.grid[x][y]
                    if (!next.visited && !next.isWall) {
                        next.previous = current.node;
                        queue.push({
                            weight: heuristics(next, src, dest),
                            node: next
                        })
                    }
                }
            }
        }
        let path = [dest]
        let node
        let pathAnimator = new Animator();
        if (dest.visited) {
            node = dest.previous;
            while (node.previous) {
                path.push(node);
                node = node.previous;
            }
            path.push(src)
            path.reverse();
            path.forEach((node) => {
                pathAnimator.push(node);
            })
        }
        return [seachAnimator, pathAnimator]
    }

    bestFirstSearchWeighted(src, dest, heuristics) {
        var seachAnimator = new Animator();
        let queue = new PriorityQueue((a, b) => a.weight < b.weight)
        src.distance = 0
        queue.push({
            weight: heuristics(src, src, dest),
            node: src,
            old: heuristics(src, src, dest)
        })
        let R = [-1, 0, 1, 0];
        let C = [0, -1, 0, 1];
        let current, x, y, next, currentHeuristic, newWeight
        while (!queue.isEmpty()) {
            current = queue.pop()
            if (current.node.visited) continue
            current.node.visited = true
            seachAnimator.push(current.node);
            if (current.node.x == dest.x && current.node.y == dest.y) break
            currentHeuristic = heuristics(current, src, dest)
            for (let i = 0; i < 4; ++i) {
                x = current.node.x + R[i]
                y = current.node.y + C[i]
                if (this.isValid(x, y)) {
                    next = this.grid[x][y]
                    if (!next.visited && !next.isWall) {
                        newWeight = (next.weight + current.old)
                        if (next.distance > newWeight) {
                            next.previous = current.node;
                            next.distance = newWeight;
                            queue.push({
                                weight: newWeight + heuristics(next, src, dest),
                                node: next,
                                old: newWeight
                            })
                        }
                    }
                }
            }
        }
        let path = [dest]
        let node
        let pathAnimator = new Animator();
        if (dest.visited) {
            node = dest.previous;
            while (node.previous) {
                path.push(node);
                node = node.previous;
            }
            path.push(src)
            path.reverse();
            path.forEach((node) => {
                pathAnimator.push(node);
            })
        }
        return [seachAnimator, pathAnimator]
    }

    greedyBFSHeuristics(current, src, dest) {
        return Math.abs(current.x - dest.x) + Math.abs(current.y - dest.y)
    }

    greedyBFS(startPoint, endPoint) {
        let src = this.grid[startPoint.x][startPoint.y]
        let dest = this.grid[endPoint.x][endPoint.y]
        if (isWeighted)
            return this.bestFirstSearchWeighted(src, dest, this.greedyBFSHeuristics)
        else
            return this.bestFirstSearch(src, dest, this.greedyBFSHeuristics)
    }

    astarHeuristics(current, src, dest) {
        return Math.abs(current.x - dest.x) + Math.abs(current.y - dest.y) + Math.abs(current.x - src.x) + Math.abs(src.y - dest.y)
    }

    astar(startPoint, endPoint) {
        // alert(isWeighted)
        let src = this.grid[startPoint.x][startPoint.y]
        let dest = this.grid[endPoint.x][endPoint.y]
        if (isWeighted)
            return this.bestFirstSearch(src, dest, this.astarHeuristics)
        else
            return this.bestFirstSearchWeighted(src, dest, this.astarHeuristics)
    }

    swarn(startPoint, endPoint) {
        let src = this.grid[startPoint.x][startPoint.y]
        let dest = this.grid[endPoint.x][endPoint.y]
        let current, heuristic;
        for (let i = 0; i < this.height; ++i) {
            for (let j = 0; j < this.width; ++j) {
                current = grid[i][j]
                heuristic = Math.abs(current.x - dest.x) + Math.abs(current.y - dest.y) + Math.abs(current.x - src.x) + Math.abs(src.y - dest.y) / 2
                current.weight += heuristic
            }
        }
        var data = this.dijkstra(startPoint, endPoint)
        for (let i = 0; i < this.height; ++i) {
            for (let j = 0; j < this.width; ++j) {
                current = grid[i][j]
                heuristic = Math.abs(current.x - dest.x) + Math.abs(current.y - dest.y) + Math.abs(current.x - src.x) + Math.abs(src.y - dest.y) / 2
                current.weight = 1
                if (isWeighted)
                    current.setRandomWeight()
                else
                    current.weight = 1
            }
        }
        return data
    }

    execute(algo, startPoint, endPoint) {
        if (algo == 'bfs') return this.bfs(startPoint, endPoint);
        if (algo == 'dfs') return this.dfs(startPoint, endPoint);
        if (algo == 'dijkstra') return this.dijkstra(startPoint, endPoint);
        if (algo == 'greedyBFS') return this.greedyBFS(startPoint, endPoint);
        if (algo == 'astar') return this.astar(startPoint, endPoint);
        if (algo == 'swarn') return this.swarn(startPoint, endPoint);
    }
}

function random(max) {
    return Math.floor(Math.random() * max);
}

class RecursiveDivision {
    constructor(grid) {
        this.grid = grid
        this.HORIZONTAL = 1
        this.VERTICAL = 2;
        this.animator = new Animator();
    }
    drawBoundaryWalls(w, h) {
        for (let i = 0; i < w; ++i) {
            grid[0][i].isWall = true;
            this.animator.push(grid[0][i]);
        }
        for (let i = 0; i < h; ++i) {
            grid[i][w - 1].isWall = true;
            this.animator.push(grid[i][w - 1]);
        }
        for (let i = w - 1; i >= 0; --i) {
            grid[h - 1][i].isWall = true;
            this.animator.push(grid[h - 1][i]);
        }
        for (let i = h - 1; i >= 0; --i) {
            grid[i][0].isWall = true;
            this.animator.push(grid[i][0]);
        }
    }
    divide(rowStart, rowEnd, colStart, colEnd, orientation) {
        if (rowEnd < rowStart || colEnd < colStart) return;
        if (orientation == this.HORIZONTAL) {
            let possibleRows = [];
            for (let i = rowStart; i <= rowEnd; i += 2) {
                possibleRows.push(i);
            }
            let possibleCols = [];
            for (let i = colStart - 1; i <= colEnd + 1; i += 2) {
                possibleCols.push(i);
            }
            let randomRowIndex = random(possibleRows.length);
            let randomColIndex = random(possibleCols.length);
            let currentRow = possibleRows[randomRowIndex];
            let passage = possibleCols[randomColIndex];
            for (let i = colStart - 1; i <= colEnd + 1; ++i) {
                let current = i

                if (current != passage) {
                    let node = grid[currentRow][current]
                    if (!node.start && !node.end) {
                        node.isWall = true;
                        this.animator.push(node);
                    }
                }
            }
            if (currentRow - 2 - rowStart > colEnd - colStart) {
                this.divide(rowStart, currentRow - 2, colStart, colEnd, orientation);
            } else {
                this.divide(rowStart, currentRow - 2, colStart, colEnd, this.VERTICAL);
            }
            if (rowEnd - (currentRow + 2) > colEnd - colStart) {
                this.divide(currentRow + 2, rowEnd, colStart, colEnd, orientation);
            } else {
                this.divide(currentRow + 2, rowEnd, colStart, colEnd, this.VERTICAL);
            }
        } else {
            let possibleRows = [];
            for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
                possibleRows.push(i);
            }
            let possibleCols = [];
            for (let i = colStart; i <= colEnd; i += 2) {
                possibleCols.push(i);
            }
            let randomColIndex = random(possibleCols.length);
            let randomRowIndex = random(possibleRows.length);
            let currentCol = possibleCols[randomColIndex];
            let passage = possibleRows[randomRowIndex];
            for (let i = rowStart - 1; i <= rowEnd + 1; ++i) {
                let current = i;
                if (current != passage && !current.start && !current.end) {
                    let node = grid[current][currentCol]
                    if (!node.start && !node.end) {
                        node.isWall = true;
                        this.animator.push(node);
                    }
                }
            }
            if (rowEnd - rowStart > currentCol - 2 - colStart) {
                this.divide(rowStart, rowEnd, colStart, currentCol - 2, this.HORIZONTAL);
            } else {
                this.divide(rowStart, rowEnd, colStart, currentCol - 2, orientation);
            }
            if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
                this.divide(rowStart, rowEnd, currentCol + 2, colEnd, this.HORIZONTAL);
            } else {
                this.divide(rowStart, rowEnd, currentCol + 2, colEnd, orientation);
            }
        }
    }
    generate() {
        var w = config.numberOfColumns
        var h = config.numberOfRows
        this.drawBoundaryWalls(w, h);
        this.divide(2, h - 3, 2, w - 3, this.HORIZONTAL);
        return this.animator
    }
}

class RandomMaze {
    constructor(grid) {
        this.grid = grid
        this.animator = new Animator();
    }
    generate() {
        var w = config.numberOfColumns
        var h = config.numberOfRows
        let randomWidth = Math.floor(Math.random() * (5 - 3) + 3)
        let parts = w / randomWidth
        let index, node;
        for (let i = 0; i < h; ++i) {
            for (let j = 0; j < parts; ++j) {
                index = Math.floor(Math.random() * randomWidth)
                node = this.grid[i][j * randomWidth + index]
                if (node && !node.start && !node.end) {
                    node.isWall = true;
                    this.animator.push(node);
                }
            }
        }
        return this.animator
    }
}


function gatherConfigDetails() {
    config.windowHeight = $(window).height();
    config.windowWidth = $(window).width();
    config.headerHeigth = $("#title").height() + 20;
    config.gridContainerHeight = config.windowHeight - config.headerHeigth - 50;
    config.gridContainerWidth = $('#grid-container').width();
    config.gridHeight = config.gridContainerHeight - 20
    config.gridWidth = config.gridContainerWidth - 20
    config.numberOfRows = Math.floor(config.gridHeight / config.nodeHeight);
    config.numberOfColumns = Math.floor(config.gridWidth / config.nodewidth) - 1;
    config.startPoint.x = Math.floor(config.numberOfRows * 0.50)
    config.endPoint.x = Math.floor(config.numberOfRows * 0.50)
    config.startPoint.y = Math.floor(config.numberOfColumns * 0.30)
    config.endPoint.y = Math.floor(config.numberOfColumns * 0.70)
    lastStart.x = config.startPoint.x;
    lastStart.y = config.startPoint.y;
    lastEnd.x = config.endPoint.x;
    lastEnd.y = config.endPoint.y;
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
    Animator.stopAllAnimation();
    isSolved = false
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
    isMouseDown = false
    moveStart = false
    moveEnd = false


}

function clearPath() {
    Animator.stopAllAnimation();
    isSolved = false
    for (let i = 0; i < config.numberOfRows; ++i) {
        for (let j = 0; j < config.numberOfColumns; ++j) {
            let node = grid[i][j];
            node.resetForMove();
        }
    }
    isMouseDown = false
    moveStart = false
    moveEnd = false
    isSolved = false
}

function afterMove() {
    Animator.stopAllAnimation();
    for (let i = 0; i < config.numberOfRows; ++i) {
        for (let j = 0; j < config.numberOfColumns; ++j) {
            let node = grid[i][j];
            node.start = false
            node.end = false
            node.node.removeClass("start");
            node.node.removeClass("end");

            if (node.x == config.startPoint.x && node.y == config.startPoint.y) {
                node.start = true;
                node.node.addClass('start');
            }
            if (node.x == config.endPoint.x && node.y == config.endPoint.y) {
                node.end = true;
                node.node.addClass('end');
            }
        }
    }
}

function init() {
    createGrid();
    algorithm.init();
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
    slider = noUiSlider.create(slider, {
        start: -2,
        connect: [true, false],
        range: {
            'min': -5,
            'max': -1
        }
    });
    slider.off('.one');
    slider.on('change', function() {
        updateSpeed(Math.round(slider.get()));
    });
}

$(function() {
    gatherConfigDetails();
    init();
    $('#introModal').modal('show');

});

function generateMaze(algo) {
    let animator
    let generator
    resetGrid()
    if (algo == 'recursive') {
        generator = new RecursiveDivision(grid);
    }
    if (algo == "random") {
        generator = new RandomMaze(grid);
    }
    animator = generator.generate();
    animator.animateWalls(config.wallAnimationSpeed)
}

function solveMaze(startPoint = null, endPoint = null) {
    if (Animator.isRunning) return
    if (startPoint == null && endPoint == null) {
        if (isSolved) clearPath()
        if (!selectedAlgorithm) {
            alert("Select the algorithm first.");
            return
        }
        let animators = algorithm.execute(selectedAlgorithm, config.startPoint, config.endPoint);
        animators[0].animateVisited(config.visitedAnimationSpeed).then((result) => {
            animators[1].animatePath(config.pathAnimationSpeed)
        })
        isSolved = true;
    } else {
        if (!isSolved) return;
        for (let i = 0; i < config.numberOfRows; ++i) {
            for (let j = 0; j < config.numberOfColumns; ++j) {
                grid[i][j].resetForMove();
            }
        }
        let src = this.grid[startPoint.x][startPoint.y]
        let dest = this.grid[endPoint.x][endPoint.y]
        let startWasWall = false
        if (src.isWall) {
            startWasWall = true
            src.isWall = false
        }
        let endWasWall = false
        if (dest.isWall) {
            endWasWall = true
            dest.isWall = false
        }
        let animators = algorithm.execute(selectedAlgorithm, startPoint, endPoint);
        animators[0].drawVisited()
        animators[1].drawPath()
        if (startWasWall) {
            src.isWall = true;
            src.reDraw();
        }
        if (endWasWall) {
            dest.isWall = true;
            dest.reDraw();
        }

    }
}

function selectAlgorithm(algo) {
    selectedAlgorithm = algo;
    if (algo == 'bfs') {
        if (isWeighted) setRandomWeight()
        $("#algorithmDropbox").html(`Algorithm : BFS <span class="caret"></span>`)
    }
    if (algo == 'dfs') {
        if (isWeighted) setRandomWeight()
        $("#algorithmDropbox").html(`Algorithm : DFS <span class="caret"></span>`)
    }
    if (algo == 'dijkstra') {
        $("#algorithmDropbox").html(`Algorithm : Dijkstra's <span class="caret"></span>`)
    }
    if (algo == 'greedyBFS') {
        $("#algorithmDropbox").html(`Algorithm : Greedy BFS <span class="caret"></span>`)
    }
    if (algo == 'astar') {
        $("#algorithmDropbox").html(`Algorithm : A * <span class="caret"></span>`)
    }
    if (algo == 'swarn') {
        $("#algorithmDropbox").html(`Algorithm : Swarn <span class="caret"></span>`)
    }
}

function disable() {
    $('button').attr('disabled', true);
    $('#slider').attr('disabled', true);

}

function enable() {
    $('button').attr('disabled', false);
    $('#slider').attr('disabled', false);
}

function setRandomWeight() {
    let btn = $("#weight")
    clearPath()
    if (btn.attr('work') == 'add') {
        $("#weight").html("Remove Weight")
        isWeighted = true
        btn.attr('work', "remove")
        let node
        for (let i = 0; i < config.numberOfRows; ++i) {
            for (let j = 0; j < config.numberOfColumns; ++j) {
                node = grid[i][j]
                node.setRandomWeight()
            }
        }
    } else {
        $("#weight").html("Add Weight")
        isWeighted = false

        btn.attr('work', "add")
        let node
        for (let i = 0; i < config.numberOfRows; ++i) {
            for (let j = 0; j < config.numberOfColumns; ++j) {
                node = grid[i][j]
                node.removeWeight()
            }
        }
    }
}

function updateSpeed(val) {
    slider.set(val)
    val = Math.abs(val)
    if (val == 1) {
        config.wallAnimationSpeed = 2
        config.visitedAnimationSpeed = 3
        config.pathAnimationSpeed = 6
    }
    if (val == 2) {
        config.wallAnimationSpeed = 3
        config.visitedAnimationSpeed = 6
        config.pathAnimationSpeed = 60
    }
    if (val == 3) {
        config.wallAnimationSpeed = 25
        config.visitedAnimationSpeed = 30
        config.pathAnimationSpeed = 100
    }
    if (val == 4) {
        config.wallAnimationSpeed = 50
        config.visitedAnimationSpeed = 100
        config.pathAnimationSpeed = 200
    }
    if (val == 5) {
        config.wallAnimationSpeed = 60
        config.visitedAnimationSpeed = 200
        config.pathAnimationSpeed = 400
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
var config = new Config();
var algorithm = new Algorithm(grid);
var isSolved = false
var selectedAlgorithm = "bfs"
var isWeighted = false
var slider = document.getElementById('slider');
window.history.replaceState("object or string", "Path Finding Visualizer", "/path-finding-visualizer");
