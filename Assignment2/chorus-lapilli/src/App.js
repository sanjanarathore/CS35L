import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [selectedSquare, setSelectedSquare] = useState(null);

  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }
    if (!allPiecesUsed(squares)) {
      if (squares[i]) {
        return;
      }
      placeNewPiece(i);
    }
    else {
      if (squares[i] === (xIsNext ? "X" : "O")) {
        setSelectedSquare(i);
        return;
      }
      if (((selectedSquare) != null) &&  (squares[i] == null)) {
        movePiece(i);
      }
    }
  }

  // placeNewPiece handles placing a new piece (assuming not all pieces have been used) to make the code more organized
  function placeNewPiece(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // movePiece moves the piece. calls a function called isLegalMove to check if the move is valid.
  function movePiece(i) {
    if (!isLegalMove(squares, selectedSquare, i)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = nextSquares[selectedSquare];
    nextSquares[selectedSquare] = null;
    setSquares(nextSquares);
    setSelectedSquare(null);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// calculateWinner calculate winner given the board state
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// allPiecesUsed returns true if each player has used 3 pieces
function allPiecesUsed(squares) {
  return squares.filter((square) => square != null).length == 6;
}

// getAdjacentEmptySquares returns list of empty adjacent squares to the selected box given the current state of the board and the index of the selected box
function getAdjacentEmptySquares(i, squares) {
  const adjacentSquares = [
    // top
    i-3,
    // bottom
    i+3,
    // left
    i%3 !== 0 ? i-1 : -1,
    // right
    i%3 !== 2 ? i+1 : -1,
    // diagonals
    i-4, i-2, i+2, i+4
  ].filter(index => index >= 0 && index < 9);
  return adjacentSquares.filter(index => squares[index] === null);
}

// isLegalMove returns true if a move is valid
function isLegalMove(squares, selectedSquare, newSquare) {
  let isAdjacent = false;
  let adjacentSquares = getAdjacentEmptySquares(selectedSquare, squares);
  // check if squares are adjacent
  if (adjacentSquares.includes(newSquare)) {
    isAdjacent = true;
  }
  // if all pieces used, center is occupied with current players token, center is not selected to move
  let isCenterAndLegal = true;
  const player = squares[selectedSquare];
  if (allPiecesUsed(squares) && (squares[4] === player) && (selectedSquare !== 4)) {
    let proposedMove = squares.slice();
    proposedMove[selectedSquare] = null;
    proposedMove[newSquare] = player;
    if (!(calculateWinner(proposedMove) === player)) {
      isCenterAndLegal = false;
    }
  }
  return isAdjacent && isCenterAndLegal;
}