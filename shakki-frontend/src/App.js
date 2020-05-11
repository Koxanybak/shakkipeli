import React, { useState, useEffect } from "react"
import Board from "./components/chess/Board"
import { Switch, Route } from "react-router-dom"
import Footer from "./components/Footer"
import LoginForm from "./components/LoginForm"
import Menu from "./components/Menu"
import { UserContext, GameContext } from "./utils/context"
import RegisterForm from "./components/RegisterForm"
import { useQuery } from "@apollo/client"
import { GET_LOGGED_USER } from "./queries"
import GameMenu from "./components/GameMenu"

const App = () => {
  const [user, setUser] = useState(null)
  const [gameId, setGameId] = useState(null)
  const userResult = useQuery(GET_LOGGED_USER, {
    variables: { token: window.sessionStorage.getItem("loggedChessUser") }
  })

  useEffect(() => {
    if (userResult.data) {
      if (userResult.data.getLoggedUser.guest) {
        setUser(userResult.data.getLoggedUser)
        window.sessionStorage.setItem("loggedChessUser", userResult.data.getLoggedUser.token)
      } else {
        setUser(userResult.data.getLoggedUser)
      }
    }
  }, [userResult.data])

  //console.log("App renderöidään")
  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <Menu />
        {user ?
          <Switch>
            <Route path="/play/:id">
              <GameContext.Provider value={{ gameId, setGameId }}>
                <Board />
              </GameContext.Provider>
            </Route>
            <Route path="/play">
              <GameContext.Provider value={{ gameId, setGameId }}>
                <GameMenu />
              </GameContext.Provider>
            </Route>
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route path="/register">
              <RegisterForm />
            </Route>
          </Switch> : "loading"
        }
        <Footer />
      </UserContext.Provider>
    </div>
  )
}

export default App
