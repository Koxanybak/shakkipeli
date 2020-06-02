import React, { useState } from "react"
import { AppBar, Toolbar, Button, Grid, IconButton, Badge } from "@material-ui/core"
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
  const { user, receivedInvs, } = useUser()
  const profileDrawerRef = React.createRef()
  const [sentInvs, setSentInvs] = useState([])

  const getNotifications = () => {
    if (user && user.receivedRequests) {
      return user.receivedRequests.length + receivedInvs.length + sentInvs.length
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
                  <Badge badgeContent={getNotifications()} color="primary">
                    <AccountCircle />
                  </Badge>
                </IconButton>
              </React.Fragment>
            }
          </Grid>
        </Grid>
        <ProfileDrawer
          receivedInvs={receivedInvs}
          sentInvs={sentInvs}
          setSentInvs={setSentInvs}
          ref={profileDrawerRef}
        />
      </Toolbar>
    </AppBar>
  )
}

export default Menu