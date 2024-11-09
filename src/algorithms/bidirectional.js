import { getUnvisitedNeighbors } from './utilities';

export function bidirectional(grid, startNode, finishNode) {
    const startQueue = [startNode];
    const finishQueue = [finishNode];
    const visitedFromStart = new Set([startNode]);
    const visitedFromFinish = new Set([finishNode]);
    const visitedNodesInOrder = [];

    while (startQueue.length && finishQueue.length) {
        if (expandFrontier(startQueue, visitedFromStart, visitedFromFinish, grid, visitedNodesInOrder)) return visitedNodesInOrder;
        if (expandFrontier(finishQueue, visitedFromFinish, visitedFromStart, grid, visitedNodesInOrder)) return visitedNodesInOrder;
    }
    return visitedNodesInOrder;
}

function expandFrontier(queue, visitedFromThisSide, visitedFromOtherSide, grid, visitedNodesInOrder) {
    const currentNode = queue.shift();
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
        if (visitedFromOtherSide.has(neighbor)) return true;  // Path found
        if (!visitedFromThisSide.has(neighbor)) {
            neighbor.previousNode = currentNode;
            visitedFromThisSide.add(neighbor);
            queue.push(neighbor);
        }
    }
    return false;
}

export function getNodesInShortestPathOrderBidirectional(meetingNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = meetingNode;
    
    // Trace back to start from meeting point
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    // Trace to finish node in reverse order
    currentNode = meetingNode;
    while (currentNode.nextNode) {
        currentNode = currentNode.nextNode;
        nodesInShortestPathOrder.push(currentNode);
    }

    return nodesInShortestPathOrder;
}