import React, { useState, useEffect } from "react"
import Board from "./components/chess/Board"
import { Switch, Route } from "react-router-dom"
import Footer from "./components/Footer"
import LoginForm from "./components/LoginForm"
import Menu from "./components/Menu"
import UserContext from "./utils/UserContext"
import RegisterForm from "./components/RegisterForm"
import { useQuery } from "@apollo/client"
import { GET_LOGGED_USER } from "./queries"

const App = () => {
  const [user, setUser] = useState(null)
  const userResult = useQuery(GET_LOGGED_USER, {
    variables: { token: window.localStorage.getItem("loggedChessUser") }
  })

  useEffect(() => {
    if (userResult.data) {
      setUser(userResult.data.getLoggedUser)
    }
  }, [userResult.data])

  console.log("App renderöidään")
  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <Menu />
        <Switch>
          <Route path="/play">
            <Board />
          </Route>
          <Route path="/login">
            <LoginForm />
          </Route>
          <Route path="/register">
            <RegisterForm />
          </Route>
        </Switch>
        <Footer />
      </UserContext.Provider>
    </div>
  )
}

export default App
