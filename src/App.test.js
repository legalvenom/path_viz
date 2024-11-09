import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Pathfinder from './Pathfinder/Pathfinder';
import Node from './Pathfinder/Node/Node';

describe('App Component', () => {
  test('renders main UI elements', () => {
    render(<App />);
    
    // Test header buttons
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Change Start')).toBeInTheDocument();
    expect(screen.getByText('Change End')).toBeInTheDocument();
    expect(screen.getByText('Clear Path')).toBeInTheDocument();
    expect(screen.getByText('Clear Board')).toBeInTheDocument();
    
    // Test distance counter
    expect(screen.getByText('Total Distance')).toBeInTheDocument();
  });
});

describe('Pathfinder Component', () => {
  test('renders grid of nodes', () => {
    render(<Pathfinder />);
    const nodes = document.querySelectorAll('.node');
    expect(nodes.length).toBeGreaterThan(0);
  });

  test('handles algorithm selection', () => {
    render(<Pathfinder />);
    const algorithmsButton = screen.getByText('Algorithms');
    fireEvent.click(algorithmsButton);
    // Add assertions for algorithm dropdown items once implemented
  });

  test('clear board functionality', () => {
    render(<Pathfinder />);
    const clearBoardButton = screen.getByText('Clear Board');
    fireEvent.click(clearBoardButton);
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => {
      expect(node.classList.contains('node-visited')).toBeFalsy();
      expect(node.classList.contains('node-path')).toBeFalsy();
    });
  });
});

describe('Node Component', () => {
  test('renders node with correct classes', () => {
    const props = {
      isStart: false,
      isFinish: false,
      isWall: false,
      row: 0,
      col: 0,
      onMouseDown: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseUp: jest.fn(),
    };

    render(<Node {...props} />);
    const node = document.querySelector('.node');
    expect(node).toBeInTheDocument();
  });

  test('applies start node class when isStart is true', () => {
    const props = {
      isStart: true,
      isFinish: false,
      isWall: false,
      row: 0,
      col: 0,
      onMouseDown: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseUp: jest.fn(),
    };

    render(<Node {...props} />);
    const node = document.querySelector('.node-start');
    expect(node).toBeInTheDocument();
  });

  test('handles mouse events correctly', () => {
    const onMouseDown = jest.fn();
    const onMouseEnter = jest.fn();
    const onMouseUp = jest.fn();

    const props = {
      isStart: false,
      isFinish: false,
      isWall: false,
      row: 0,
      col: 0,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    };

    render(<Node {...props} />);
    const node = document.querySelector('.node');
    
    fireEvent.mouseDown(node);
    expect(onMouseDown).toHaveBeenCalled();
    
    fireEvent.mouseEnter(node);
    expect(onMouseEnter).toHaveBeenCalled();
    
    fireEvent.mouseUp(node);
    expect(onMouseUp).toHaveBeenCalled();
  })});
