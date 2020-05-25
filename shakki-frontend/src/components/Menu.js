import React from "react"
import { AppBar, Toolbar, Button, /* Typography */ } from "@material-ui/core"
import { Link, } from "react-router-dom"
import { useUser } from "../utils/stateHooks"

const Menu = () => {
  /* const { user, removeUser } = useUser() */

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/play">
          Pelaa
        </Button>
        <Button color="inherit" component={Link} to="/info">
          Ohjeet
        </Button>
        {/* {!user || user.guest 
          ?
          <Button color="inherit" component={Link} to="/login">
            Kirjaudu
          </Button>
          :
          <Typography variant="subtitle1" color="textPrimary">
              &quot;{user.tag}&quot; kirjautunut
          </Typography>
        } */}
        {/* {!user || user.guest 
          ?
          null
          :
          <Button color="inherit" onClick={() => removeUser()} component={Link} to="/">
            Kirjaudu ulos
          </Button>
        } */}
      </Toolbar>
    </AppBar>
  )
}

export default Menu