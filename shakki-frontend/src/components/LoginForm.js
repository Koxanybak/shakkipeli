import React, { useState, useEffect, useContext } from "react"
import { TextField, Button, } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { LOGIN } from "../queries"
import { useMutation } from "@apollo/client"
import UserContext from "../utils/UserContext"


const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { setUser } = useContext(UserContext)

  const history = useHistory()

  const [login, loginResult] = useMutation(LOGIN, {
    onError: err => {
      console.log(err.graphQLErrors[0].message)
      setPassword("")
    }
  })

  const onSubmit = event => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  useEffect(() => {
    if (loginResult.data) {
      setUsername("")
      setPassword("")

      console.log(loginResult.data.login.token)
      window.localStorage.setItem("loggedChessUser", loginResult.data.login.token)
      setUser(loginResult.data.login)

      history.push("/")
    }
  }, [loginResult.data, setUser, history])

  return (
    <div>
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            label="Käyttäjänimi"
            onChange={e => {setUsername(e.target.value)}}
            name="username"
          />
        </div>
        <div>
          <TextField
            label="Salasana"
            type="password"
            onChange={e => {setPassword(e.target.value)}}
            name="password"
          />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            Kirjaudu
          </Button>
        </div>
      </form>
      <div>
        tai
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={() => history.push("/register")}>
          Luo uusi käyttäjä
        </Button>
      </div>
    </div>
  )
}

export default LoginForm