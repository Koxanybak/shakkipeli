import React, { useState } from "react"
import { TextField, Button, } from "@material-ui/core"
import { useHistory } from "react-router-dom"


const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const history = useHistory()

  const onSubmit = event => {
    event.preventDefault()

  }

  return (
    <div>
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField label="Käyttäjänimi" onChange={e => {setUsername(e.target.value)}} />
        </div>
        <div>
          <TextField label="Salasana" type="password" onChange={e => {setPassword(e.target.value)}} />
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

/*<strong>Älä käytä samaa salasanaa, joka sinulla on muilla nettisivuilla. </strong>
          En voi taata sivuston tietoturvallisuutta.*/

export default LoginForm