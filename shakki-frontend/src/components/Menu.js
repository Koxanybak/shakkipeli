import React from "react"
import { AppBar, Toolbar, Button, makeStyles, Grid, IconButton, Badge } from "@material-ui/core"
import { Link, } from "react-router-dom"
import { useUser } from "../utils/stateHooks"
import ProfileDrawer from "./ProfileDrawer"
import { AccountCircle } from "@material-ui/icons"

const useStyles = makeStyles(() => ({
  info: {
    marginRight: "80vh",
  }
}))

const Menu = () => {
  const { user } = useUser()
  const profileDrawerRef = React.createRef()

  const getFriendRequests = () => {
    if (user && user.receivedRequests) {
      return user.receivedRequests.length
    }
    return 0
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justify="space-between"
        >
          <Grid item>
            <Button color="inherit" component={Link} to="/play">
              Pelaa
            </Button>
            <Button color="inherit" component={Link} to="/info">
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
              <React.Fragment>
                <IconButton onClick={() => profileDrawerRef.current.openDrawer()}>
                  <Badge badgeContent={getFriendRequests()} color="primary">
                    <AccountCircle />
                  </Badge>
                </IconButton>
              </React.Fragment>
            }
          </Grid>
        </Grid>
        <ProfileDrawer ref={profileDrawerRef} />
      </Toolbar>
    </AppBar>
  )
}

export default Menu