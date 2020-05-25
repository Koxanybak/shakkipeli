import React, { useState } from "react"
import { getImgSrc } from "./pieces"
import { Button, makeStyles, Typography, Paper } from "@material-ui/core"
import { WHITESQUARE_COLOR, BLACKSQUARE_COLOR } from "../../utils/constants"

const getLocation = (location) => {
  if (location.column === 0) {
    return `A${8 - (location.row)}`
  }
  if (location.column === 1) {
    return `B${8 - (location.row)}`
  }
  if (location.column === 2) {
    return `C${8 - (location.row)}`
  }
  if (location.column === 3) {
    return `D${8 - (location.row)}`
  }
  if (location.column === 4) {
    return `E${8 - (location.row)}`
  }
  if (location.column === 5) {
    return `F${8 - (location.row)}`
  }
  if (location.column === 6) {
    return `G${8 - (location.row)}`
  }
  if (location.column === 7) {
    return `H${8 - (location.row)}`
  } else {
    return "ErrorLocation"
  }
}

/* const useStyles = makeStyles({
  moves: {
    background: `rgb(${WHITESQUARE_COLOR})`,
  }
}) */

const Move = ({ move, emphasize }) => {
  const emphasizeStyle = {
    borderLeftStyle: "solid",
    borderColor: "blue",
    borderWidth: "1px",
    borderLeftWidth: "10px",

    padding: 10,
    background: "cyan",
  }
  const moveStyle = {
    borderLeftStyle: "solid",
    borderColor: "blue",
    borderWidth: "1px",
    borderLeftWidth: "5px",

    margin: 5,
    background: "cyan"
  }
  const pieceStyle = emphasize ? {
    height: 60,
    width: 60,
  } : undefined

  if (move.__typename === "OrdinaryMove") {
    return (
      <Paper style={emphasize ? emphasizeStyle : moveStyle}>
        <img
          style={pieceStyle}
          className="piece"
          draggable="false"
          src={getImgSrc(move.piece.type, move.piece.side)}
          alt={move.piece.type}
        />
        {getLocation(move.newLocation)}
      </Paper>
    )
  }
  if (move.__typename === "CastlingMove") {
    return (
      <Paper style={emphasize ? emphasizeStyle : moveStyle}>
        Tornitus
      </Paper>
    )
  }
  if (move.__typename === "PromotionMove") {
    return (
      <Paper style={emphasize ? emphasizeStyle : moveStyle}>
        {getLocation(move.promotedPiece.location)}
        <img
          style={pieceStyle}
          className="piece"
          draggable="false"
          src={getImgSrc(move.promotedPiece.type, move.promotedPiece.side)}
          alt={move.promotedPiece.type}
        />
        {"--->"}
        <img
          style={pieceStyle}
          className="piece"
          draggable="false"
          src={getImgSrc(move.promotedTo, move.promotedPiece.side)}
          alt={move.promotedPiece.type}
        />
      </Paper>
    )
  }
  return (
    <Paper>
      Error
    </Paper>
  )
}

const MoveHistory = ({ moveHistory }) => {
  const moveHistoryStyle = {
    overflowY: "scroll",
    height: 350,
  }
  return (
    <div className="moveHistory" style={moveHistoryStyle}>
      {moveHistory.map((move, index) => {

        move = moveHistory[moveHistory.length - 1 - index]
        
        // other moves
        if (index !== 0) {
          return <Move move={move} key={index} />
        } else {
          return null
        }
      })}
    </div>
  )
}

const LastMove = ({ moveHistory }) => {
  const [showAll, setShowAll] = useState(false)
  const style = {
    background: `linear-gradient(135deg, rgb(${WHITESQUARE_COLOR}), rgb(${BLACKSQUARE_COLOR}))`,
    padding: "20px",
    /* height: "auto", */
    /* margin: "2vh" */
  }

  if (moveHistory.length === 0) {
    return (
      <div>
        Siirtoja ei ole tehty
      </div>
    )
  }

  const lastMove = moveHistory[moveHistory.length - 1]

  return (
    <Paper style={style}>
      <Typography variant="h5">
        Viimeisin siirto
      </Typography>
      <Move move={lastMove} emphasize={true} />
      <Button variant="contained" onClick={() => setShowAll(!showAll)} color="primary">
        Näytä kaikki siirrot
      </Button>
      {showAll ? <MoveHistory moveHistory={moveHistory} /> : null}
    </Paper>
  )
}

export default LastMove