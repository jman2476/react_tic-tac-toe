import { useState, useEffect } from 'react'

/* TODO: Add updates to the game:
  X 1. For current move, show "You are at move #" instead of button
  X 2. Rewrite Board component to render using two loops instead of hardcoding squares
  X 3. Toggle button for ascending/descending move list
  X 4. When someone wins, highlight the winning squares
  X 5. Display coordinates for each move in move history list
    6. Make it pretty and personal
*/
function Square({ value, onSquareClick, isHighlit }) {

    return (
        <button 
            className={isHighlit? 'winning-square square': 'square'}
            onClick={onSquareClick}
        >
            {value}
        </button>
    )
}

function Board({ xIsNext, squares, onPlay}) {
    console.log('Board component', squares)
    function handleClick(index) {
        if (squares[index] || calculateWinner(squares)[0]) return // returns from function if square is filled or a player has won
        const nextSquares = squares.slice()
        if (xIsNext) {
            nextSquares[index] = "X"
        } else {
            nextSquares[index] = "O"
        }
        onPlay(nextSquares, index)
    }
    const [winner, highlightSquares] = calculateWinner(squares)
    const boardRows = Array(3).fill(null).map((row, index) => {
        const newRow = Array(3).fill().map((_, column) => {
            const squareIndex = index * 3 + column
            if (!highlightSquares) {
                return (
                    <Square key={squareIndex} value={squares[squareIndex]} onSquareClick={() => handleClick(squareIndex)}/>
            )} else {
                return (
                    <Square key={squareIndex} value={squares[squareIndex]} onSquareClick={() => handleClick(squareIndex)} isHighlit={highlightSquares.includes(squareIndex)}/>
            )
            }
        })
        
        return (
            <div className='board-row' key={index}>{newRow}</div>
        )
    })

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
    const [history, setHistory] = useState([[Array(9).fill(null)], 'start'])
    const [currentMove, setCurrentMove] = useState(0)
    const [listIsAscending, setListIsAscending] = useState(true)
    const xIsNext = currentMove % 2 === 0
    const currentSquares = history[currentMove][0]

    

    function handlePlay(nextSquares, nextIndex) {
        const nextHistory = [...history.slice(0, currentMove + 1), [nextSquares, nextIndex]]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
    }

    function jumpTo(nextMove){
        setCurrentMove(nextMove)
    }

    function handleToggle(){
        setListIsAscending(!listIsAscending)
    }
    const moves = history.map((squares, move) => {
        let description
        console.log('moves const:', squares[1])
        const coordinates = squares[1] === 'start'? '' : squareToCoordinates(squares[1])
        if (move === currentMove){
            if (move > 0){
                return (
                    <li key={move}>Current move: {move} at {coordinates[0]},{coordinates[1]}</li>
                ) 
            }
            return (
                <li key={move}>Game start: make a move!</li>
            ) 
        }
        if (squares === 'start') return

        if (move > 0 ) {
            description = 'Go to move #' + move + ' at square ' + coordinates
        } else {
            description = 'Go to game start'
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    })
    const reversedMoves = moves.toReversed()
    
    return (
        <div className='game'>
            <div className='game-board'>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className='game-info'>
                <button className="toggle" onClick={handleToggle}>List direction</button>
                <ol>{listIsAscending? moves : reversedMoves}</ol>
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
            return [squares[a], lines[i]]
        }
    }

    for (let i = 0; i < squares.length; i++){
        if (!squares[i]) return [null, null]

    }
    return ['Nobody', null]
}

function squareToCoordinates(square){
    return [Math.floor(square/3), square%3]
}