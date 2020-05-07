import React from "react"
import { AppBar, Toolbar, IconButton, Button } from "@material-ui/core"
import { Link, } from "react-router-dom"

const Menu = () => {
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
        <Button color="inherit" component={Link} to="/login">
          Kirjaudu
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Menu