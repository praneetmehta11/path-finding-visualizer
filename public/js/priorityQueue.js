const heapTop = 0;
const heapParent = i => ((i + 1) >>> 1) - 1;
const heapLeft = i => (i << 1) + 1;
const heapRight = i => (i + 1) << 1;

class PriorityQueue {
    constructor(comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }
    size() {
        return this._heap.length;
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek() {
        return this._heap[heapTop];
    }
    push(...values) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > heapTop) {
            this._swap(heapTop, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    replace(value) {
        const replacedValue = this.peek();
        this._heap[heapTop] = value;
        this._siftDown();
        return replacedValue;
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > heapTop && this._greater(node, heapParent(node))) {
            this._swap(node, heapParent(node));
            node = heapParent(node);
        }
    }
    _siftDown() {
        let node = heapTop;
        while (
            (heapLeft(node) < this.size() && this._greater(heapLeft(node), node)) ||
            (heapRight(node) < this.size() && this._greater(heapRight(node), node))
        ) {
            let maxChild = (heapRight(node) < this.size() && this._greater(heapRight(node), heapLeft(node))) ? heapRight(node) : heapLeft(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}