import { depthLimited } from './dls';

export function iterativeDeepening(grid, startNode, finishNode, maxDepth) {
    let visitedNodesInOrder = [];
    for (let depth = 0; depth <= maxDepth; depth++) {
        const result = depthLimited(grid, startNode, finishNode, depth);
        visitedNodesInOrder = visitedNodesInOrder.concat(result);
        if (result.length && result[result.length - 1] === finishNode) break;
    }
    return visitedNodesInOrder;
}

export function getNodesInShortestPathOrderIDS(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
