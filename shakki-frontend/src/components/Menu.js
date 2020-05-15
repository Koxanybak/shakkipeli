import React from "react"
import { AppBar, Toolbar, IconButton, Button, Typography } from "@material-ui/core"
import { Link, } from "react-router-dom"
import { useUser } from "../utils/stateHooks"

const Menu = () => {
  const { user, setUser } = useUser()

  console.log("At menu user is:", user)

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit" component={Link} to="/play">
          Pelaa
        </Button>
        <Button color="inherit" component={Link} to="/info">
          Ohjeet
        </Button>
        {!user || user.guest 
          ?
          <Button color="inherit" component={Link} to="/login">
            Kirjaudu
          </Button>
          :
          <Typography variant="subtitle1" color="textPrimary">
              &quot;{user.tag}&quot; kirjautunut
          </Typography>
        }
        {!user || user.guest 
          ?
          null
          :
          <Button color="inherit" onClick={() => setUser(null)} component={Link} to="/">
            Kirjaudu ulos
          </Button>
        }
      </Toolbar>
    </AppBar>
  )
}

export default Menu