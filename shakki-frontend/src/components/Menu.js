import React from "react"
import { AppBar, Toolbar, Button, Grid, IconButton, Badge, Typography } from "@material-ui/core"
import { Link, } from "react-router-dom"
import { useUser } from "../utils/stateHooks"
import ProfileDrawer from "./ProfileDrawer"
import { AccountCircle } from "@material-ui/icons"

/* const useStyles = makeStyles(() => ({
  info: {
    marginRight: "80vh",
  }
})) */

const Menu = () => {
  const { user, } = useUser()
  const profileDrawerRef = React.createRef()

  //console.log("Menu is rendered and invs are", receivedInvs)

  const getNotifications = () => {
    if (user) {
      /* console.log(user.receivedRequests ? user.receivedRequests.length : 0)
      console.log(user.receivedInvites ? user.receivedInvites.length : 0)
      console.log(user.sentInvites ? user.sentInvites.length : 0)
      console.log((user.receivedRequests ? user.receivedRequests.length : 0) + 
        (user.receivedInvites ? user.receivedInvites.length : 0) + 
        (user.sentInvites ? user.sentInvites.length : 0)) */
      return (user.receivedRequests ? user.receivedRequests.length : 0) + 
      (user.receivedInvites ? user.receivedInvites.length : 0)
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
            <Typography variant="subtitle2">
              Ongelmatilanteessa sivun uudelleenlaataaminen yleensä auttaa.
            </Typography>
          </Grid>
          <Grid item>
            {!user || user.guest 
              ?
              <Button color="inherit" component={Link} to="/login">
                Kirjaudu
              </Button>
              :
              <React.Fragment>
                <IconButton onClick={() => profileDrawerRef.current.openDrawer()} id="profile-button">
                  <Badge badgeContent={getNotifications()} color="primary">
                    <AccountCircle style={{ color: "white" }} />
                  </Badge>
                </IconButton>
              </React.Fragment>
            }
          </Grid>
        </Grid>
        <ProfileDrawer
          ref={profileDrawerRef}
        />
      </Toolbar>
    </AppBar>
  )
}

export default Menu