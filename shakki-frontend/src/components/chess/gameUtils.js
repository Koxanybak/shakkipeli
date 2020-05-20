import { HIGHLIGHTED_COLOR, WHITESQUARE_COLOR, BLACKSQUARE_COLOR } from "../../utils/constants"

// checks is the square is valid to move to
export const isNotValid = ({ squareNode, pieceToMove, clickedPiece, game, user }) => {
  return (
    squareNode.style.background !== `radial-gradient(rgb(${HIGHLIGHTED_COLOR}), rgb(${BLACKSQUARE_COLOR}))` &&
    squareNode.style.background !== `radial-gradient(rgb(${HIGHLIGHTED_COLOR}), rgb(${WHITESQUARE_COLOR}))`
  ) || 
  (
    clickedPiece &&
    clickedPiece.id === pieceToMove.id
  ) ||
  (
    game.gameOver ||
    game.promotionPlayerID
  ) ||
  (
    user.id !== game.currentPlayer
  )
}

// checks if the piece is valid for movement
export const isValidPiece = ({ clickedPiece, game, user }) => {
  /* console.log(clickedPiece)
  console.log(game)
  console.log(user) */
  /* console.log("user.id === game.currentPlayer", user.id === game.currentPlayer)
  console.log("clickedPiece.side === game.whitePlayer === user.id ? white : black",clickedPiece.side === (game.whitePlayer === user.id ? "white" : "black"))
  console.log("!game.promotionPlayerID",!game.promotionPlayerID)
  console.log("!game.gameOver",!game.gameOver) */
  return (
    user.id === game.currentPlayer &&
    clickedPiece.side === (game.whitePlayer === user.id ? "white" : "black")
  ) &&
  (
    !game.promotionPlayerID &&
    !game.gameOver
  )
}