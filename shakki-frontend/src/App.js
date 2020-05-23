import React from "react"
import { Grid } from "@material-ui/core"
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
      <Grid
        container
        direction="column"
        alignItems="center"
        //justify="flex-end"
      >
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
      </Grid>
    </div>
  )
}

export default App
