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
import { Container, makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    height: "100%",
  }
})

const App = () => {
  const { user } = useUser()
  const classes = useStyles()

  return (
    <Container classes={classes}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="space-between"
        classes={classes}
        wrap="nowrap"
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
    </Container>
  )
}

export default App
