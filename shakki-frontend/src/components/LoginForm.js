import React, { useState, useEffect } from "react"
import { TextField, Button, Checkbox, FormControlLabel, } from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { LOGIN } from "../queries"
import { useMutation } from "@apollo/client"
import { useUser } from "../utils/stateHooks"


const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)

  const { setUser } = useUser()

  const history = useHistory()

  const [login, loginResult] = useMutation(LOGIN, {
    onError: err => {
      if (!err.graphQLErrors || !err.graphQLErrors[0]) {
        console.log(err.message)
      } else {
        console.log(err.graphQLErrors[0].message)
      }
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
    }
  }, [loginResult.data, setUser, history, remember])

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