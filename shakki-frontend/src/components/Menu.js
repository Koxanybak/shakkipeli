import React, { useContext } from "react"
import { AppBar, Toolbar, IconButton, Button, Typography } from "@material-ui/core"
import { Link, } from "react-router-dom"
import UserContext from "../utils/UserContext"

const Menu = () => {
  const { user } = useContext(UserContext)

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit" component={Link} to="/play">
          Pelaa
        </Button>
        <Button color="inherit" component={Link} to="/info">
          Tietoa
        </Button>
        {!user 
          ?
          <Button color="inherit" component={Link} to="/login">
            Kirjaudu
          </Button>
          :
          <Typography variant="subtitle1" color="secondary">
              `&quot;`{user.tag}`&quot;` kirjautunut
          </Typography>
        }
      </Toolbar>
    </AppBar>
  )
}

export default Menu