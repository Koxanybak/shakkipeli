import React from "react"
import { AppBar, Toolbar, Button, Typography, makeStyles, Grid } from "@material-ui/core"
import { Link, } from "react-router-dom"
import { useUser } from "../utils/stateHooks"
import ProfileDrawer from "./ProfileDrawer"

const useStyles = makeStyles(() => ({
  info: {
    marginRight: "80vh",
  }
}))

const Menu = () => {
  const { user, removeUser } = useUser()
  const profileDrawerRef = React.createRef()
  const classes = useStyles()

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Button color="inherit" component={Link} to="/play">
              Pelaa
            </Button>
            <Button className={classes.info} color="inherit" component={Link} to="/info">
              Ohjeet
            </Button>
          </Grid>
          <Grid item>
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
              <Button color="inherit" onClick={() => removeUser()} component={Link} to="/">
                Kirjaudu ulos
              </Button>
            }
            <Button onClick={() => profileDrawerRef.current.openDrawer()}>
              Avaa profiili
            </Button>
          </Grid>
        </Grid>
        <ProfileDrawer ref={profileDrawerRef} />
      </Toolbar>
    </AppBar>
  )
}

export default Menu