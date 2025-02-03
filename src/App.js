import { useState, useEffect } from 'react'

/* TODO: Add updates to the game:
  X 1. For current move, show "You are at move #" instead of button
  X 2. Rewrite Board component to render using two loops instead of hardcoding squares
    3. Toggle button for ascending/descending move list
    4. When someone wins, highlight the winning squares
    5. Display coordinates for each move in move history list
    6. Make it pretty and personal
*/
function Square({ value, onSquareClick }) {

    return (
        <button 
            className="square"
            onClick={onSquareClick}
        >
            {value}
        </button>
    )
}

function Board({ xIsNext, squares, onPlay}) {
    console.log('Board component', squares)
    function handleClick(index) {
        if (squares[index] || calculateWinner(squares)) return // returns from function if square is filled or a player has won
        const nextSquares = squares.slice()
        if (xIsNext) {
            nextSquares[index] = "X"
        } else {
            nextSquares[index] = "O"
        }
        onPlay(nextSquares)
    }

    const boardRows = Array(3).fill(null).map((row, index) => {
        const newRow = Array(3).fill().map((_, column) => {
            const squareIndex = index * 3 + column
            return (
                <Square key={squareIndex} value={squares[squareIndex]} onSquareClick={() => handleClick(squareIndex)}/>
            )
        })
        
        return (
            <div className='board-row' key={index}>{newRow}</div>
        )
    })

    const winner = calculateWinner(squares)
    let status;
    if (winner) {
        status = "Winner: " + winner
    } else {
        status = "Next player: " + (xIsNext ? 'X' : 'O')
    }

    return (
    <>
        <div className="status">{status}</div>
        <div className="board">{boardRows}</div>
    </> )
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)])
    const [currentMove, setCurrentMove] = useState(0)
    const xIsNext = currentMove % 2 === 0
    const currentSquares = history[currentMove]

    // useEffect hook to print out entire history array for debugging
    // useEffect(() => {
    //     console.log(history)
    // }, [history])

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
    }

    function jumpTo(nextMove){
        setCurrentMove(nextMove)
    }

    const moves = history.map((squares, move) => {
        let description
        if (move === currentMove){
            if (move > 0){
                return (
                    <li key={move}>Current move: {move}</li>
                ) 
            }
            return (
                <li key={move}>Game start: make a move!</li>
            ) 
        }

        if (move > 0) {
            description = 'Go to move #' + move
        } else {
            description = 'Go to game start'
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    })
    return (
        <div className='game'>
            <div className='game-board'>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className='game-info'>
                <ol>{moves}</ol>
            </div>
        </div>
    )
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ]

    for (let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }

    for (let i = 0; i < squares.length; i++){
        if (!squares[i]) return null

    }
    return 'Nobody'
}