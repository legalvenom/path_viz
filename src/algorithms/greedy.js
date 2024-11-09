import { getUnvisitedNeighbors } from './utilities';

export function greedyBFS(grid, startNode, finishNode) {
    const openSet = [startNode];
    const visitedNodesInOrder = [];
    startNode.distance = 0;

    while (openSet.length > 0) {
        openSet.sort((nodeA, nodeB) => heuristic(nodeA, finishNode) - heuristic(nodeB, finishNode));
        const currentNode = openSet.shift();

        if (currentNode.isWall) continue;
        if (currentNode.isVisited) continue;
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === finishNode) return visitedNodesInOrder;
        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.previousNode = currentNode;
                openSet.push(neighbor);
            }
        }
    }
    return visitedNodesInOrder;
}

function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

export function getNodesInShortestPathOrderGreedyBFS(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
