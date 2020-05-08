import React, { useState, useEffect } from "react"
import { TextField, Button, } from "@material-ui/core"
import { useMutation } from "@apollo/client"
import { ADD_USER } from "../queries"
import { useHistory } from "react-router-dom"

const RegisterForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [tag, setTag] = useState("")
  const history = useHistory()

  const [addUser, addedResult] = useMutation(ADD_USER, {
    onError: err => {
      console.log(err.graphQLErrors[0].message)
      window.alert(err.graphQLErrors[0].message)
    }
  })

  const onSubmit = event => {
    event.preventDefault()

    const user = { username, password, tag }
    addUser({ variables: { user } })
  }

  useEffect(() => {
    if (addedResult.data) {
      setUsername("")
      setPassword("")
      setTag("")

      window.alert("Käyttäjä luotu onnistuneesti.")
      history.push("/")
    }
  }, [addedResult.data, history])

  return (
    <div>
      <h2>Luo uusi käyttäjä</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            label="Käyttäjänimi"
            onChange={e => {setUsername(e.target.value)}}
            error={username.length !== 0 && username.length < 2}
            helperText={
              username.length !== 0 && username.length < 2
                ? "Liian lyhyt"
                : "Käyttäjänimesi ei näy muille pelaajille."
            }
            required={true}
          />
        </div>
        <div>
          <TextField
            label="Pelinimi"
            onChange={e => {setTag(e.target.value)}}
            helperText="Nimi joka näkyy muille pelaajille."
            required={true}
          />
        </div>
        <div>
          <TextField
            label="Salasana"
            type="password"
            onChange={e => {setPassword(e.target.value)}}
            error={password.length < 8 && password !== ""}
            helperText={
              password.length < 8 && password !== ""
                ? "Liian lyhyt"
                : null
            }
            required={true}
          />
          <div
            style={{
              paddingTop: 20,
              paddingBottom: 10,
            }}
          >
            <strong>Älä käytä samaa salasanaa, joka sinulla on muilla nettisivuilla. </strong>
            Olen vain opiskelija, ja tämä on ensimmäinen nettiprojektini, joten en voi taata sivuston tietoturvallisuutta.
          </div>
        </div>
        <div>
          <TextField
            label="Salasana uudelleen"
            type="password"
            onChange={e => {setConfirmation(e.target.value)}}
            error={confirmation !== password}
            helperText={confirmation !== password ? "Salasanat eivät vastaa toisiaan." : null}
            required={true}
          />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            Luo käyttäjä
          </Button>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm