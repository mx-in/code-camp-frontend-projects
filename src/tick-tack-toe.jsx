import { useState } from 'react'
import './tick-tack-toe.scss'

const signA = '💰'
const signB = '💎'
const signEmpty = '◯'

const GameStatus = {
  Playing: 0,
  Over: 1,
  Ready: 2,
  Unready: 3,
  History: 4
}

function Square(props) {
  return (
    `${props.text.length}`.length && (
      <div className="square" onClick={props.onClick}>
        <span className="index">{props.index + 1}</span>
        <span className="text">{props.text}</span>
      </div>
    )
  )
}

function statusTxt(status, curSign, winner, historyIdx) {
  switch (status) {
    case GameStatus.Ready:
    case GameStatus.Playing:
      return curSign && `${curSign} turn to play`
    case GameStatus.Over: {
      if (winner) {
        if (winner === signEmpty) {
          return 'draw, press restart to play again'
        } else {
          return `${winner} win, press restart to play again`
        }
      }
      break
    }
    case GameStatus.Unready:
      return 'please choose the sign which will be first to play'
    case GameStatus.History:
      return `now at step ${historyIdx}`
    default:
      return 'unknown status'
  }
}

function getWinner(squares) {
  const checkMatrix = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ]

  let winner = signEmpty
  let winnerPositions = []

  for (let i = 0; i < checkMatrix.length; i++) {
    const [h1, h2, h3] = checkMatrix[i]
    if (
      squares[h1 - 1] !== signEmpty &&
      squares[h1 - 1] === squares[h2 - 1] &&
      squares[h1 - 1] === squares[h3 - 1]
    ) {
      winnerPositions = [h1 - 1, h2 - 1, h3 - 1]
      winner = squares[h1 - 1]
    }

    const v1 = checkMatrix[0][i] - 1
    const v2 = checkMatrix[1][i] - 1
    const v3 = checkMatrix[2][i] - 1
    if (
      squares[v1] !== signEmpty &&
      squares[v1] === squares[v2] &&
      squares[v1] === squares[v3]
    ) {
      winnerPositions = [v1, v2, v3]
      winner = squares[v1]
    }
  }

  const diagonals = [0, 1, 2]
  const d1 = diagonals.map(i => checkMatrix[i][i] - 1)
  const [d1_1, d1_2, d1_3] = d1
  if (
    squares[d1_1] !== signEmpty &&
    squares[d1_1] === squares[d1_2] &&
    squares[d1_1] === squares[d1_3]
  ) {
    winnerPositions = [d1_1, d1_2, d1_3]
    winner = squares[d1_1]
  }

  const d2 = diagonals.map(i => checkMatrix[i][2 - i] - 1)
  const [d2_1, d2_2, d2_3] = d2
  if (
    squares[d2_1] !== signEmpty &&
    squares[d2_1] === squares[d2_2] &&
    squares[d2_1] === squares[d2_3]
  ) {
    winnerPositions = [d2_1, d2_2, d2_3]
    winner = squares[d2_1]
  }

  return {
    winner,
    winnerPositions: winnerPositions.map(i => i + 1)
  }
}

function TickTackToeGame() {
  const [squares, setSquares] = useState(Array(9).fill(signEmpty))
  const [curSign, setCurSign] = useState(signEmpty)
  const [startSign, setStartSign] = useState(signEmpty)
  const [status, setStatus] = useState(GameStatus.Unready)
  const [historyIdx, setHistoryIdx] = useState(0)
  const [gameHistory, setGameHistory] = useState([squares.slice()])
  const [winner, setWinner] = useState(signEmpty)
  const [winnerPostions, setWinnerPostions] = useState([])

  const onClick = i => {
    const value = squares[i]
    const isCheckingHistory = status === GameStatus.History
    const isClickEnable =
      (status === GameStatus.Ready ||
        status === GameStatus.Playing ||
        isCheckingHistory) &&
      value === signEmpty

    if (!isClickEnable) {
      return
    }

    const newSquares = squares.slice()
    setSquares(newSquares)
    status !== GameStatus.Playing && setStatus(GameStatus.Playing)

    curSign === signA ? setCurSign(signB) : setCurSign(signA)
    newSquares[i] = curSign

    const { winner, winnerPositions } = getWinner(newSquares)
    setWinner(winner)
    setWinnerPostions(winnerPositions)
    winner !== signEmpty && setStatus(GameStatus.Over)

    const history = isCheckingHistory
      ? gameHistory.splice(0, historyIdx + 1)
      : gameHistory

    history.push(newSquares.slice())
    setGameHistory(history)
    setHistoryIdx(history.length - 1)

    history.length > 9 && setStatus(GameStatus.Over)
  }

  const initialGame = () => {
    setCurSign(signEmpty)
    setStatus(GameStatus.Unready)
    setSquares(Array(9).fill(signEmpty))
    setGameHistory([squares])
    setWinner(signEmpty)
    setWinnerPostions([])
  }

  const setStarter = player => {
    initialGame()
    setCurSign(player)
    setStartSign(player)
    setStatus(GameStatus.Ready)
  }

  const moveToHistory = i => {
    setSquares(gameHistory[i].slice())
    const secondStarerSign = startSign === signA ? signB : signA
    setCurSign(i % 2 === 0 ? startSign : secondStarerSign)
    setStatus(GameStatus.History)
    setHistoryIdx(i)
  }

  const onSteptBtnClick = i => {
    moveToHistory(i)
  }

  const onPreBtnClick = () => {
    moveToHistory(Math.max(historyIdx - 1, 0))
  }

  const onNextBtnClick = () => {
    moveToHistory(Math.min(gameHistory.length - 1, historyIdx + 1))
  }

  return (
    <main>
      <h1>Tick Tack Toe</h1>
      <h3>{statusTxt(status, curSign, winner, historyIdx)}</h3>
      {!!winnerPostions.length && status !== GameStatus.History && (
        <h3>winner selected position: {winnerPostions.map(i => `${i} `)}</h3>
      )}
      <div className="container">
        <div className="c-group">
          {curSign === signEmpty ? (
            <>
              <span>choose: </span>
              <button onClick={() => setStarter(signA)}>{signA}</button>
              <button onClick={() => setStarter(signB)}>{signB}</button>
            </>
          ) : (
            <span>start with {startSign}</span>
          )}
        </div>
        <div className="c-group">
          <span>operations: </span>
          <button onClick={onPreBtnClick}>pre</button>
          <button onClick={onNextBtnClick}>next</button>
          <button onClick={initialGame}>restart</button>
        </div>
        {gameHistory.length > 1 && (
          <div className="c-group">
            <span>history: </span>
            {gameHistory.map((_, i) => (
              <button onClick={() => onSteptBtnClick(i)} key={i}>
                #{i}
              </button>
            ))}
          </div>
        )}
        <div className="squares">
          {squares.map((text, i) => (
            <Square key={i} index={i} text={text} onClick={() => onClick(i)} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default TickTackToeGame
