import { GameStatus, SignEmpty } from './consts.js'

export function getWinner(squares) {
  const checkMatrix = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ]

  let winner = SignEmpty
  let winnerPositions = []

  for (let i = 0; i < checkMatrix.length; i++) {
    const [h1, h2, h3] = checkMatrix[i]
    if (
      squares[h1 - 1] !== SignEmpty &&
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
      squares[v1] !== SignEmpty &&
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
    squares[d1_1] !== SignEmpty &&
    squares[d1_1] === squares[d1_2] &&
    squares[d1_1] === squares[d1_3]
  ) {
    winnerPositions = [d1_1, d1_2, d1_3]
    winner = squares[d1_1]
  }

  const d2 = diagonals.map(i => checkMatrix[i][2 - i] - 1)
  const [d2_1, d2_2, d2_3] = d2
  if (
    squares[d2_1] !== SignEmpty &&
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

export function statusTxt(status, curSign, winner, historyIdx) {
  switch (status) {
    case GameStatus.Ready:
    case GameStatus.Playing:
      return curSign && `${curSign} turn to play`
    case GameStatus.Over: {
      if (winner) {
        if (winner === SignEmpty) {
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
