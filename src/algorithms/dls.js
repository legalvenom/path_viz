import { getUnvisitedNeighbors } from './utilities';

export function depthLimited(grid, startNode, finishNode, limit) {
    const visitedNodesInOrder = [];
    const result = recursiveDLS(startNode, finishNode, grid, limit, visitedNodesInOrder);
    return result ? visitedNodesInOrder : [];
}

function recursiveDLS(node, finishNode, grid, limit, visitedNodesInOrder) {
    if (node === finishNode) return true;
    if (limit <= 0) return false;

    node.isVisited = true;
    visitedNodesInOrder.push(node);

    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
            neighbor.previousNode = node;
            if (recursiveDLS(neighbor, finishNode, grid, limit - 1, visitedNodesInOrder)) return true;
        }
    }
    return false;
}

export function getNodesInShortestPathOrderDLS(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
