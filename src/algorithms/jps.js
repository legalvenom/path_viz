import { getUnvisitedNeighbors } from './utilities';

export function jumpPoint(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const openSet = [startNode];
    startNode.distance = 0;

    while (openSet.length) {
        openSet.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
        const currentNode = openSet.shift();

        if (currentNode.isWall || currentNode.isVisited) continue;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === finishNode) return visitedNodesInOrder;
        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (jump(neighbor, currentNode, finishNode, grid)) {
                neighbor.previousNode = currentNode;
                openSet.push(neighbor);
            }
        }
    }
    return visitedNodesInOrder;
}

// Jump function (basic version) checks if a point can be "jumped" over.
function jump(node, previousNode, finishNode, grid) {
    if (node === finishNode) return true;
    const neighbors = getUnvisitedNeighbors(node, grid);
    return neighbors.length > 0;
}

export function getNodesInShortestPathOrderJPS(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}


