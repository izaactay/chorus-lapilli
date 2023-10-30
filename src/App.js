import React from 'react';
import './index.css';
import { useState } from 'react';

function Square({ value, onSquareClick,SqColor }) {
  let stylename = SqColor ? SqColor:'square';
  return (
    <button className={stylename} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, moveCount}) {

  //nextSquares[9][0] is the select flag
  //nextSquares[9][1] is the update history flag
  //nextSquares[9][2] is the previous square moved
  
  const prevSelected = squares[9][2];
  function handleClick(i) {
    
    if (calculateWinner(squares)) {
      return;
    }
    const nextSquares = JSON.parse(JSON.stringify(squares));
    
    if (moveCount === 5) {
      
      nextSquares[9][0] = true;
    }
    if (moveCount > 5) {
      if (nextSquares[9][0]) {
        if (xIsNext && nextSquares[i][0] === 'X') {

          
          nextSquares[i][1] = 'RedSquare';
          nextSquares[9][1] = true;
          nextSquares[9][0] = false;
          nextSquares[9][2] = i;
          
          
        }
        else if (!xIsNext && nextSquares[i][0] === 'O') {
          
          nextSquares[i][1] = 'RedSquare';
          nextSquares[9][1] = true;
          nextSquares[9][0] = false;
          nextSquares[9][2] = i;
          
          
        } else {
          return;
        }
        
      } else {
        if  (prevSelected === i) {
          
          nextSquares[i][1] = null;
          nextSquares[9][1] = true;
          nextSquares[9][0] = true;
          
          
          
        } else if (!squares[i][0] && validMoves(prevSelected,i)) {
          if (((xIsNext && (squares[4][0]==='X')) || (!xIsNext && (squares[4][0]==='O'))) && (prevSelected !== 4)) {
            
            nextSquares[i][0] = squares[prevSelected][0];
            nextSquares[prevSelected][0] = null;
            if (calculateWinner(nextSquares)) {
              nextSquares[prevSelected][1] = null;
            } else {
              nextSquares[prevSelected][0] = nextSquares[i][0];
              nextSquares[i][0] = null;
              return;
            }
          } else {
            nextSquares[i][0] = squares[prevSelected][0];
            nextSquares[prevSelected][0] = null;
            nextSquares[prevSelected][1] = null;
            nextSquares[9][1] = false;
            nextSquares[9][0] = true;
            
          }
        } else {
          return;
        }
      }
    }



    else if (!squares[i][0]){
      if (xIsNext) {
        nextSquares[i][0] = 'X';
      } else {
        nextSquares[i][0] = 'O';
      }

    } else {
      return;
    }
    
    
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0][0]} onSquareClick={() => handleClick(0)} SqColor={squares[0][1]} />
        <Square value={squares[1][0]} onSquareClick={() => handleClick(1)} SqColor={squares[1][1]} />
        <Square value={squares[2][0]} onSquareClick={() => handleClick(2)} SqColor={squares[2][1]} />
      </div>
      <div className="board-row">
        <Square value={squares[3][0]} onSquareClick={() => handleClick(3)} SqColor={squares[3][1]}/>
        <Square value={squares[4][0]} onSquareClick={() => handleClick(4)} SqColor={squares[4][1]}/>
        <Square value={squares[5][0]} onSquareClick={() => handleClick(5)} SqColor={squares[5][1]}/>
      </div>
      <div className="board-row">
        <Square value={squares[6][0]} onSquareClick={() => handleClick(6)} SqColor={squares[6][1]}/>
        <Square value={squares[7][0]} onSquareClick={() => handleClick(7)} SqColor={squares[7][1]}/>
        <Square value={squares[8][0]} onSquareClick={() => handleClick(8)} SqColor={squares[8][1]}/>
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(10).fill(null).map(()=> new Array(3).fill(null))]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  

  function handlePlay(nextSquares) {
    var nextHistory = [];
    if (nextSquares[9][1] === true) {
      nextHistory = [...history.slice(0, currentMove), JSON.parse(JSON.stringify(nextSquares))];
      nextHistory = JSON.parse(JSON.stringify(nextHistory));
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    } else {
      nextHistory = [...history.slice(0, currentMove+1), JSON.parse(JSON.stringify(nextSquares))];
      nextHistory = JSON.parse(JSON.stringify(nextHistory));
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    };
    
    
  }

  function jumpTo(nextMove) {
    console.log(nextMove);
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="container-instructions">
      <div className="game-instructions">
        <h1>Chorus Lapilli: The Game</h1>
        <p>Rules: Chorus lapilli is like tic-tac-toe in that players take turn placing pieces on a 3×3 board and the goal is to get three pieces in a row. However, it differs from tic-tac-toe in two ways: <br></br>

            1. After your first three moves, instead of adding further pieces you must instead move one of your existing pieces to an adjacent empty square. Therefore, after your third move you always occupy three squares. The move can be up, down, left, right, or diagonal.<br></br>
            2. If it is your turn to move and you have three pieces on the board and one of your pieces is in the center square, your move must either win or vacate the center square.</p>
      </div>
      </div>
      <div className="container-game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} moveCount={currentMove}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length-1; i++) {
    const [a, b, c] = lines[i];
    if (squares[a][0] && squares[a][0] === squares[b][0] && squares[a][0] === squares[c][0]) {
      return squares[a][0];
    }
  }
  return null;
}

function validMoves(prev,curr) {
  const moves = [
    new Set([1,3,4]),
    new Set([0,2,3,4,5]),
    new Set([1,4,5]),
    new Set([0,1,4,6,7]),
    new Set([0,1,2,3,5,6,7,8]),
    new Set([1,2,4,7,8]),
    new Set([3,4,7]),
    new Set([3,4,5,6,8]),
    new Set([4,5,7]),
  ];
  
  return moves[prev].has(curr);
}