import React, { useState } from "react"
import { Grid, CircularProgress } from "@material-ui/core"
import { Switch, Route } from "react-router-dom"
import Footer from "./components/Footer"
import LoginForm from "./components/LoginForm"
import Menu from "./components/Menu"
import RegisterForm from "./components/RegisterForm"
import GameMenu from "./components/GameMenu"
import Game from "./components/chess/Game"
import { useUser } from "./utils/stateHooks"
import { Container, makeStyles } from "@material-ui/core"
import { FeedbackContext } from "./utils/context"
import Feedback from "./components/Feedback"
import Info from "./components/Info"

const useStyles = makeStyles({
  root: {
    height: "100%",
  }
})

const App = () => {
  const { user } = useUser()
  const classes = useStyles()
  const [feedback, setFeedback] = useState(null)
  //console.log("app rendering and feedback is", feedback)

  return (
    <FeedbackContext.Provider value={{ feedback, setFeedback }}>
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
              <Route path="/info">
                <Info />
              </Route>
            </Switch>
            : <CircularProgress />
          }
          <Feedback />
          <Footer />
        </Grid>
      </Container>
    </FeedbackContext.Provider>
  )
}

export default App
