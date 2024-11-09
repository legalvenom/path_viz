import React, {Component} from "react";
import './Node.css';

export default class Node extends Component {
    render() {
        const {
          col,
          isFinish,
          isStart,
          isWall,
          onMouseDown,
          onMouseEnter,
          onMouseUp,
          row,
          lock,
          shiftStartNode,
          row_start,
          changing_start,
          changing_finish,
          shiftEndNode,
        } = this.props;
        const extraClassName = isFinish
          ? 'node-finish'
          : isStart
          ? 'node-start'
          : isWall
          ? 'node-wall'
          : '';
    
        return (
          <>
          {
            lock ?
          <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            ></div>
            
            : changing_start ?
            <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onClick={()=> shiftStartNode(row,col)}
            ></div>
          
            : changing_finish ?
            <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onClick={()=> shiftEndNode(row,col)}
            ></div>
          
            :
            <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}
            onClick={()=> shiftEndNode(row,col)}
            ></div>
            
          }
            </>
        );
      }
}