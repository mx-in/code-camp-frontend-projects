import { useEffect, useState } from 'react'
import './index.scss'
import { GameStatus, SignA, SignB, SignEmpty } from './consts.js'
import { getNextStep, getWinner, statusTxt } from './utils.js'

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

function TickTackToeGame() {
  const [squares, setSquares] = useState(Array(9).fill(SignEmpty))
  const [curSign, setCurSign] = useState(SignEmpty)
  const [startSign, setStartSign] = useState(SignEmpty)
  const [status, setStatus] = useState(GameStatus.Unready)
  const [historyIdx, setHistoryIdx] = useState(0)
  const [gameHistory, setGameHistory] = useState([squares.slice()])
  const [winner, setWinner] = useState(SignEmpty)
  const [winnerPostions, setWinnerPostions] = useState([])
  const [lastPosition, setLastPosition] = useState(0)

  const initialGame = () => {
    setCurSign(SignEmpty)
    setStatus(GameStatus.Unready)
    setSquares(Array(9).fill(SignEmpty))
    setGameHistory([squares])
    setWinner(SignEmpty)
    setWinnerPostions([])
  }
  const onClick = i => {
    setLastPosition(i)
    const value = squares[i]
    const isCheckingHistory = status === GameStatus.History
    const isClickEnable =
      (status === GameStatus.Ready ||
        status === GameStatus.Playing ||
        isCheckingHistory) &&
      value === SignEmpty

    if (!isClickEnable) {
      return
    }

    const newSquares = squares.slice()
    setSquares(newSquares)
    status !== GameStatus.Playing && setStatus(GameStatus.Playing)

    const nextSign = curSign === SignA ? SignB : SignA
    newSquares[i] = curSign
    setCurSign(nextSign)

    const { winner, winnerPositions } = getWinner(newSquares)
    setWinner(winner)
    setWinnerPostions(winnerPositions)
    winner !== SignEmpty && setStatus(GameStatus.Over)

    const history = isCheckingHistory
      ? gameHistory.splice(0, historyIdx + 1)
      : gameHistory

    history.push(newSquares.slice())
    setGameHistory(history)
    setHistoryIdx(history.length - 1)

    history.length > 9 && setStatus(GameStatus.Over)
  }

  useEffect(() => {
    if (curSign !== startSign) {
      const nextStep = getNextStep(squares, lastPosition, curSign)
      if (nextStep >= 0) {
        onClick(nextStep)
      }
    }
  }, [curSign])

  const setStarter = player => {
    initialGame()
    setCurSign(player)
    setStartSign(player)
    setStatus(GameStatus.Ready)
  }

  const moveToHistory = i => {
    setSquares(gameHistory[i].slice())
    const secondStarerSign = startSign === SignA ? SignB : SignA
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
    <>
      <main>
        <h1>Tick Tack Toe</h1>
        <h3>{statusTxt(status, curSign, winner, historyIdx)}</h3>
        {!!winnerPostions.length && status !== GameStatus.History && (
          <h3>winner selected position: {winnerPostions.map(i => `${i} `)}</h3>
        )}
        <div className="container">
          <div className="c-group">
            {curSign === SignEmpty ? (
              <>
                <span>choose: </span>
                <button onClick={() => setStarter(SignA)}>{SignA}</button>
                <button onClick={() => setStarter(SignB)}>{SignB}</button>
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
                <button
                  className={
                    i === historyIdx ? 'selected-history-btn' : 'history-btn'
                  }
                  onClick={() => onSteptBtnClick(i)}
                  key={i}
                >
                  #{i}
                </button>
              ))}
            </div>
          )}
          <div className="squares">
            {squares.map((text, i) => (
              <Square
                key={i}
                index={i}
                text={text}
                onClick={() => onClick(i)}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default TickTackToeGame
