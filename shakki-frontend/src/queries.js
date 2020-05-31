import { gql } from "@apollo/client"


// fragments
const LOCATION = gql`
  fragment location on Location {
    row
    column
  }
`

const IDLE_PIECE = gql`
  fragment idlePiece on Piece {
    type
    side
    location {
      ...location
    }
  }
  ${LOCATION}
`

const MOVED_PIECE = gql`
  fragment movedPiece on Piece {
    type
    side
    lastLocation {
      ...location
    }
  }
  ${LOCATION}
`

const MOVE_HISTORY_ENTRY = gql`
 fragment moveHistoryEntry on MoveHistoryEntry {
   leadToCheck
   wonTheGame
 }
`

const GAME_STATE_DETAILS = gql`
  fragment gameStateDetails on Game {
    board {
      ...idlePiece
      id
      availableMoves {
        newLocation {
          ...location
        }
      }
    }
    id
    currentPlayer
    whitePlayer
    blackPlayer
    winner
    gameOver
    promotionPlayerID
    check {
      threatenedPlayer
      movesAvailable {
        piece {
          type
          side
        }
        newLocation {
          ...location
        }
      }
    }
    moveHistory {
      ... on CastlingMove {
        piece {
          ...movedPiece
        }
        castledPiece {
          ...movedPiece
        }
      }
      ... on PromotionMove {
        promotedPiece {
          ...idlePiece
        }
        promotedTo
      }
      ... on OrdinaryMove {
        piece {
          ...movedPiece
        }
        pieceEaten {
          ...idlePiece
        }
        newLocation {
          ...location
        }
      }
      ... on SkipMove {
        isSkip
      }
      ...moveHistoryEntry
    }
  }
  ${LOCATION}
  ${IDLE_PIECE}
  ${MOVED_PIECE}
  ${MOVE_HISTORY_ENTRY}
`
/* ${MOVED_PIECE}
  ${MOVE_HISTORY_ENTRY} */

/* moveHistory {
  ... on OrdinaryMove {
    piece {
      ...movedPiece
    }
    pieceEaten {
      ...idlePiece
    }
    newLocation {
      ...location
    }
  }
  ... on CastlingMove {
    piece {
      ...movedPiece
    }
    castledPiece {
      ...movedPiece
    }
  }
  ... on PromotionMove {
    promotedPiece {
      ...idlePiece
    }
    promotedTo
  }
  ...moveHistoryEntry
} */


// mutations and queries

// game related
export const GET_GAME = gql`
  query getGame($gameId: String!) {
    getGame(
      gameId: $gameId
    ) {
      ...gameStateDetails
    }
  }
  ${GAME_STATE_DETAILS}
`

export const SKIP_TURN = gql`
  mutation skipTurn($gameId: String!) {
    skipTurn(
      gameId: $gameId
    ) {
      ...gameStateDetails
    }
  }
  ${GAME_STATE_DETAILS}
`

export const GAME_STATE_UPDATED = gql`
  subscription gameStateUpdated($gameId: String!) {
    gameStateUpdated(
      gameId: $gameId
    ) {
      ...gameStateDetails
    }
  }
  ${GAME_STATE_DETAILS}
`

export const JOIN_GAME = gql`
  mutation joinGame($gameId: String!) {
    joinGame(
      gameId: $gameId
    ) {
      ...gameStateDetails
    }
  }
  ${GAME_STATE_DETAILS}
`

export const PROMOTE = gql`
  mutation promote($gameId: String!, $pieceType: String!) {
    promote(
      gameId: $gameId,
      pieceType: $pieceType
    ) {
      ...gameStateDetails
    }
  }
  ${GAME_STATE_DETAILS}
`

export const MAKE_MOVE = gql`
  mutation makeMove($move: MoveInput!) {
    makeMove(
      move: $move
    ) {
      lastMove {
        success
        message
      }
    }
  }
`

export const CREATE_GAME = gql`
  mutation createGame {
    createGame {
      board {
        type
        side
      }
      id
    }
  }
`

// user related

// fragments
const REQUEST_DETAILS = gql`
  fragment requestDetails on FriendRequest {
    from {
      tag
    }
    to {
      tag
    }
    id
  }
`
const USER_DETAILS = gql`
  fragment userDetails on UserWithToken {
    username
    tag
    friends {
      tag
    }
    sentRequests {
      ...requestDetails
    }
    receivedRequests {
      ...requestDetails
    }
    guest
    id
    token
  }
  ${REQUEST_DETAILS}
`

// rest
export const GET_LOGGED_USER = gql`
  query getLoggedUser($token: String) {
    getLoggedUser(
      token: $token
    ) {
      ...userDetails
    }
  }
  ${USER_DETAILS}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      ...userDetails
    }
  }
`

export const ADD_USER = gql`
  mutation addUser($user: NewUserInput!) {
    addUser(
      user: $user
    ) {
      username
      tag
      id
    }
  }
`

// friend related
export const REQUEST_RECEIVED = gql`
  subscription requestReceived($userId: String) {
    requestReceived(
      userId: $userId
    ) {
      ...requestDetails
    }
  }
  ${REQUEST_DETAILS}
`

export const REQUEST_ACCEPTED = gql`
  subscription requestAccepted($userId: String) {
    requestAccepted(
      userId: $userId
    )
  }
`

export const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($tag: String) {
    sendFriendRequest(
      tag: $tag
    ) {
      ...requestDetails
    }
  }
  ${REQUEST_DETAILS}
`

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation acceptFriendRequest($requestId: String) {
    acceptFriendRequest(
      requestId: $requestId
    )
  }
`

export const REMOVE_FRIEND = gql`
  mutation removeFriend($tag: String) {
    removeFriend(
      tag: $tag
    )
  }
`