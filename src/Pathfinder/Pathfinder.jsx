import React, { Component } from "react";
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { DFS, getNodesInShortestPathOrderDFS } from '../algorithms/dfs';
import { astar, getNodesInShortestPathOrderAstar } from '../algorithms/astar';
import { greedyBFS, getNodesInShortestPathOrderGreedyBFS } from '../algorithms/greedy';
import { BFS, getNodesInShortestPathOrderBFS } from '../algorithms/bfs';
import { bidirectional, getNodesInShortestPathOrderBidirectional } from '../algorithms/bidirectional';
import { jumpPoint, getNodesInShortestPathOrderJPS } from '../algorithms/jps';
import { depthLimited, getNodesInShortestPathOrderDLS } from '../algorithms/dls';
import { iterativeDeepening, getNodesInShortestPathOrderIDS } from '../algorithms/ids';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import './Pathfinder.css';

export default class Pathfinder extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      row_start: 10,
      col_start: 15,
      row_finish: 10,
      col_finish: 35,
      changing_start: false,
      changing_finish: false,
      lock: false,
      visited_arr: [],
      shortest_path: [],
      maze: [],
      distance: 0
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    if (newGrid) {
      const maze = [...this.state.maze, newGrid[1]];
      this.setState({ grid: newGrid[0], mouseIsPressed: true, maze: maze });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    if (newGrid) {
      const maze = [...this.state.maze, newGrid[1]];
      this.setState({ grid: newGrid[0], maze: maze });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeAlgorithm(algorithm, getPath) {
    this.setState({ lock: true });
    const { grid } = this.state;
    const startNode = grid[this.state.row_start][this.state.col_start];
    const finishNode = grid[this.state.row_finish][this.state.col_finish];
    const visitedNodesInOrder = algorithm(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getPath(finishNode);
    
    if (finishNode.col === nodesInShortestPathOrder[0].col && 
        finishNode.row === nodesInShortestPathOrder[0].row) {
      alert("No solution! Please edit the board");
      this.setState({ lock: false });
    } else {
      this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
      this.setState({
        visited_arr: visitedNodesInOrder,
        shortest_path: nodesInShortestPathOrder,
        distance: nodesInShortestPathOrder.length - 1
      });
    }
  }

  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col, row) {
    return {
      col,
      row,
      isStart: row === this.state.row_start && col === this.state.col_start,
      isFinish: row === this.state.row_finish && col === this.state.col_finish,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isFinish || node.isStart) {
      return false;
    }
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return [newGrid, newNode];
  }

  clearBoard = () => {
    const newGrid = this.state.grid.map(row => row.map(node => ({
        ...node,
        distance: Infinity,
        isVisited: false,
        isPath: false,
        previousNode: null,
        isWall: false, // This clears walls as well
    })));
    this.setState({ grid: newGrid });
}

clearPath = () => {
    const newGrid = this.state.grid.map(row => row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
    })));
    this.setState({ grid: newGrid });
}

  shiftStartNode(row, col) {
    if (this.state.changing_start) {
      const newGrid = this.state.grid.slice();
      const node = newGrid[row][col];
      
      if (node.isWall || node.isFinish) return;
      
      const oldNode = newGrid[this.state.row_start][this.state.col_start];
      oldNode.isStart = false;
      document.getElementById(`node-${this.state.row_start}-${this.state.col_start}`).className = 'node';
      
      node.isStart = true;
      document.getElementById(`node-${row}-${col}`).className = 'node node-start';
      
      this.setState({
        grid: newGrid,
        row_start: row,
        col_start: col
      });
    }
  }

  shiftEndNode(row, col) {
    if (this.state.changing_finish) {
      const newGrid = this.state.grid.slice();
      const node = newGrid[row][col];
      
      if (node.isWall || node.isStart) return;
      
      const oldNode = newGrid[this.state.row_finish][this.state.col_finish];
      oldNode.isFinish = false;
      document.getElementById(`node-${this.state.row_finish}-${this.state.col_finish}`).className = 'node';
      
      node.isFinish = true;
      document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
      
      this.setState({
        grid: newGrid,
        row_finish: row,
        col_finish: col
      });
    }
  }

  toggleStartNodeChange = () => {
    this.setState({ changing_start: !this.state.changing_start });
  }

  toggleEndNodeChange = () => {
    this.setState({ changing_finish: !this.state.changing_finish });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <div className="header">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Algorithms
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => this.visualizeAlgorithm(dijkstra, getNodesInShortestPathOrder)}>
                Dijkstra's Algorithm
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.visualizeAlgorithm(DFS, getNodesInShortestPathOrderDFS)}>
                Depth-First Search
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.visualizeAlgorithm(BFS, getNodesInShortestPathOrderBFS)}>
                Breadth-First Search
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.visualizeAlgorithm(astar, getNodesInShortestPathOrderAstar)}>
                A* Search
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.visualizeAlgorithm(greedyBFS, getNodesInShortestPathOrderGreedyBFS)}>
                Greedy Best-First Search
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.visualizeAlgorithm(bidirectional, getNodesInShortestPathOrderBidirectional)}>
                Bidirectional Search
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.visualizeAlgorithm(jumpPoint, getNodesInShortestPathOrderJPS)}>
                Jump Point Search
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.visualizeAlgorithm(depthLimited, getNodesInShortestPathOrderDLS)}>
                Depth-Limited Search
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.visualizeAlgorithm(iterativeDeepening, getNodesInShortestPathOrderIDS)}>
                Iterative Deepening Search
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button onClick={this.toggleStartNodeChange}>
            {this.state.changing_start ? "Save Start" : "Change Start"}
          </Button>
          <Button onClick={this.toggleEndNodeChange}>
            {this.state.changing_finish ? "Save End" : "Change End"}
          </Button>
          <Button onClick={() => this.clearPath()}>
            Clear Path
          </Button>
          <Button onClick={() => this.clearBoard()}>
            Clear Board
          </Button>
        </div>

        <div className="grid">
          <h4>Total Distance: {this.state.distance}</h4>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                      shiftStartNode={(row, col) => this.shiftStartNode(row, col)}
                      shiftEndNode={(row, col) => this.shiftEndNode(row, col)}
                      lock={this.state.lock}
                      changing_start={this.state.changing_start}
                      changing_finish={this.state.changing_finish}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}