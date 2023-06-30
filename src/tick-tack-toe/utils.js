import { CheckMatrix, GameStatus, SignEmpty } from './consts.js'

export function getWinner(squares) {
  let winner = SignEmpty
  let winnerPositions = []

  for (let i = 0; i < CheckMatrix.length; i++) {
    const [h1, h2, h3] = CheckMatrix[i]
    if (
      squares[h1 - 1] !== SignEmpty &&
      squares[h1 - 1] === squares[h2 - 1] &&
      squares[h1 - 1] === squares[h3 - 1]
    ) {
      winnerPositions = [h1 - 1, h2 - 1, h3 - 1]
      winner = squares[h1 - 1]
    }

    const v1 = CheckMatrix[0][i] - 1
    const v2 = CheckMatrix[1][i] - 1
    const v3 = CheckMatrix[2][i] - 1
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
  const d1 = diagonals.map(i => CheckMatrix[i][i] - 1)
  const [d1_1, d1_2, d1_3] = d1
  if (
    squares[d1_1] !== SignEmpty &&
    squares[d1_1] === squares[d1_2] &&
    squares[d1_1] === squares[d1_3]
  ) {
    winnerPositions = [d1_1, d1_2, d1_3]
    winner = squares[d1_1]
  }

  const d2 = diagonals.map(i => CheckMatrix[i][2 - i] - 1)
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

// [4, 9, 2],
// [3, 5, 7],
// [8, 1, 6]
const pathsCache = {}
const positionMap = {}
CheckMatrix.forEach((row, i) => {
  row.forEach((value, j) => {
    positionMap[value] = [j, i]
  })
})

function getAvaliablePaths(x, y) {
  if (pathsCache[`${x}-${y}`]) {
    return pathsCache[`${x}-${y}`]
  }

  const paths = []
  const p1 = []
  for (let i = x + 1; i < 3; i++) {
    p1.push(CheckMatrix[y][i])
  }
  for (let i = x - 1; i >= 0; i--) {
    p1.push(CheckMatrix[y][i])
  }
  p1.length && paths.push(p1)

  const p2 = []
  for (let i = y + 1; i < 3; i++) {
    p2.push(CheckMatrix[i][x])
  }
  for (let i = y - 1; i >= 0; i--) {
    p2.push(CheckMatrix[i][x])
  }
  p2.length && paths.push(p2)

  if (x === y) {
    const p3 = []
    for (let i = x + 1; i < 3; i++) {
      p3.push(CheckMatrix[i][i])
    }
    for (let i = x - 1; i >= 0; i--) {
      p3.push(CheckMatrix[i][i])
    }
    p3.length && paths.push(p3)
  }

  if (x * -1 + 2 === y) {
    const p4 = []
    for (let i = x + 1; i < 3; i++) {
      p4.push(CheckMatrix[-1 * i + 2][i])
    }
    for (let i = x - 1; i >= 0; i--) {
      p4.push(CheckMatrix[-1 * i + 2][i])
    }
    p4.length && paths.push(p4)
  }
  pathsCache[`${x}-${y}`] = paths

  return paths
}

/**
 * get next step position
 * @param {Array} squares
 * @param {Number} lastPosition
 * @param {String} curSign
 * @return {Number} next position for squares index
 *
 **/
export function getNextStep(squares, lastPosition, curSign) {
  if (lastPosition < 0) {
    return -1
  }
  const [x, y] = positionMap[lastPosition + 1]
  const paths = getAvaliablePaths(x, y)

  let mostClosePath = []
  let mostClosePathCount = -1
  /* iterate paths to find which path just need one step to win
  if found, return the position */
  for (let i = 0; i < paths.length; i++) {
    let signCount = 0
    let emptyCount = 0

    paths[i].forEach(position => {
      if (squares[position - 1] === SignEmpty) {
        emptyCount++
      } else if (squares[position - 1] !== curSign) {
        signCount++
      }
    })

    if (signCount >= 2) {
      return -1
    }

    if (signCount >= mostClosePathCount && emptyCount >= 1) {
      mostClosePathCount = signCount
      mostClosePath = paths[i]
    }
  }

  const [p1, p2] = mostClosePath
  if (squares[p1 - 1] === SignEmpty) {
    return p1 - 1
  }
  return p2 - 1
}
