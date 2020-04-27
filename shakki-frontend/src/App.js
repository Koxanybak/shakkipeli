import React from "react"
import Board from "./components/Board"

const App = () => {
  return (
    <div>
      <Board />
      <div style={{
        height: 50,
        width: 50,
        backgroundColor: "#e04c4c",
      }}></div>
    </div>
  )
}

export default App
