import React from "react"
import { Switch, Route } from "react-router-dom"
import Footer from "./components/Footer"
import LoginForm from "./components/LoginForm"
import Menu from "./components/Menu"
import RegisterForm from "./components/RegisterForm"
import GameMenu from "./components/GameMenu"
import Game from "./components/chess/Game"
import { useUser } from "./utils/stateHooks"

const App = () => {
  const { user } = useUser()

  return (
    <div>
      <Menu />
      {user
        ?
        <Switch>
          <Route path="/play/:id">
            <Game />
          </Route>
          <Route path="/play">
            <GameMenu />
          </Route>
          <Route path="/login">
            <LoginForm />
          </Route>
          <Route path="/register">
            <RegisterForm />
          </Route>
        </Switch>
        : "Ladataan..."
      }
      <Footer />
    </div>
  )
}

export default App
