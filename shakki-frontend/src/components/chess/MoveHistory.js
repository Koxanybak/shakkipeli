import React from "react"
import { getImgSrc } from "./pieces"

const getLocation = (location) => {
  if (location.column === 0) {
    return `A${location.row}`
  }
  if (location.column === 1) {
    return `B${location.row}`
  }
  if (location.column === 2) {
    return `C${location.row}`
  }
  if (location.column === 3) {
    return `D${location.row}`
  }
  if (location.column === 4) {
    return `E${location.row}`
  }
  if (location.column === 5) {
    return `F${location.row}`
  }
  if (location.column === 6) {
    return `G${location.row}`
  }
  if (location.column === 7) {
    return `H${location.row}`
  } else {
    return "ErrorLocation"
  }
}

const MoveHistory = ({ moveHistory }) => {
  return (
    <div className="moveHistory">
      {moveHistory.map((move, index) => {
        // last move
        if (index === moveHistory.length - 1) {
          if (move.__typename === "OrdinaryMove") {
            return (
              <div key={index}>
                <img
                  className="piece"
                  draggable="false"
                  src={getImgSrc(move.piece.type, move.piece.side)}
                  alt={move.piece.type}
                />
                {getLocation(move.newLocation)}
              </div>
            )
          }
          if (move.__typename === "CastlingMove") {
            return (
              <div key={index}>
                Tornitus
              </div>
            )
          }
          if (move.__typename === "PromotionMove") {
            return (
              <div key={index}>
                {getLocation(move.promotedPiece.location)}
                <img
                  className="piece"
                  draggable="false"
                  src={getImgSrc(move.promotedPiece.type, move.promotedPiece.side)}
                  alt={move.promotedPiece.type}
                />
                {"--->"}
                <img
                  className="piece"
                  draggable="false"
                  src={getImgSrc(move.promotedTo, move.promotedPiece.side)}
                  alt={move.promotedPiece.type}
                />
              </div>
            )
          }
        }

        // other moves
        if (move.__typename === "OrdinaryMove") {
          return (
            <div key={index}>
              <img
                className="piece"
                draggable="false"
                src={getImgSrc(move.piece.type, move.piece.side)}
                alt={move.piece.type}
              />
              {getLocation(move.newLocation)}
            </div>
          )
        }
        if (move.__typename === "CastlingMove") {
          return (
            <div key={index}>
              Tornitus
            </div>
          )
        }
        if (move.__typename === "PromotionMove") {
          return (
            <div key={index}>
              {getLocation(move.promotedPiece.location)}
              <img
                className="piece"
                draggable="false"
                src={getImgSrc(move.promotedPiece.type, move.promotedPiece.side)}
                alt={move.promotedPiece.type}
              />
              {"--->"}
              <img
                className="piece"
                draggable="false"
                src={getImgSrc(move.promotedTo, move.promotedPiece.side)}
                alt={move.promotedPiece.type}
              />
            </div>
          )
        }
        return (
          <div key={index}>
            Error
          </div>
        )
      })}
    </div>
  )
}

export default MoveHistory