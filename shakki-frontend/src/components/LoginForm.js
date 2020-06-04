import React, { useState, useEffect, useContext } from "react"
import { TextField, Button, Checkbox, FormControlLabel, Paper, } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { LOGIN } from "../queries"
import { useMutation } from "@apollo/client"
import { useUser } from "../utils/stateHooks"
import { FeedbackContext } from "../utils/context"


const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const { setFeedback } = useContext(FeedbackContext)

  const { setUser } = useUser()

  const history = useHistory()

  const [login, loginResult] = useMutation(LOGIN, {
    onError: err => {
      if (!err.graphQLErrors || !err.graphQLErrors[0]) {
        console.log(err.message)
      } else {
        console.log(err.graphQLErrors[0].message)
      }
      setFeedback({ message: err.message, severity: "error" })
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

      setUser(loginResult.data.login, remember)

      history.push("/")
      window.location.reload(true)
    }
  }, [loginResult.data, setUser, history, remember])

  return (
    <div>
      <Paper style={{ padding: 10 }}>
        <h2>Kirjaudu sisään</h2>
        <form onSubmit={onSubmit}>
          <div>
            <TextField
              id="username"
              label="Käyttäjänimi"
              value={username}
              onChange={e => {setUsername(e.target.value)}}
              name="username"
            />
          </div>
          <div>
            <TextField
              id="password"
              label="Salasana"
              type="password"
              value={password}
              onChange={e => {setPassword(e.target.value)}}
              name="password"
            />
          </div>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  name="rememberMe"
                  color="primary"
                />
              }
              label="Muista minut"
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              id="login-button"
            >
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
      </Paper>
    </div>
  )
}

export default LoginForm