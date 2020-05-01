import React from "react"
import Board from "./components/chess/Board"
import { Switch, Route } from "react-router-dom"
import Footer from "./components/Footer"
import LoginForm from "./components/LoginForm"
import Menu from "./components/Menu"

const App = () => {
  console.log("App renderöidään")
  return (
    <div>
      <Menu />
      <Switch>
        <Route path="/play">
          <Board />
        </Route>
        <Route path="/login">
          <LoginForm />
        </Route>
      </Switch>
      <Footer />
    </div>
  )
}

export default App
