import React, { useState, useImperativeHandle } from "react"
import { SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Link, Divider, } from "@material-ui/core"
import { ExitToApp, PersonAdd } from "@material-ui/icons"
import AddFriendDialog from "./AddFriendDialog"
import { useUser } from "../utils/stateHooks"

const ProfileDrawer = React.forwardRef((_, ref) => {
  const [show, setShow] = useState(false)
  const { user, removeUser } = useUser()
  const friendRef = React.createRef()

  const openDrawer = () => {
    setShow(true)
  }

  useImperativeHandle(ref, () => {
    return {
      openDrawer
    }
  })

  return (
    <React.Fragment>
      <SwipeableDrawer
        open={show}
        onClose={() => setShow(false)}
        onOpen={() => setShow(true)}
        anchor="right"
      >
        <div>
          <List>
            {user && user.receivedRequests.length !== 0
              ? <React.Fragment>
                <ListItem>
                  <ListItemText primary="Kaveripyynnöt" />
                </ListItem>
                {user.receivedRequests.map(req => {
                  return (
                    <ListItem key={req.id}>
                      <ListItemText secondary={`Käyttäjältä ${req.from.tag}`} />
                    </ListItem>
                  )
                })}
                <Divider />
              </React.Fragment>
              : null
            }
            <ListItem>
              <ListItemText primary="Kaverit" />
            </ListItem>
            {user && user.friends.length !== 0
              ? user.friends.map(f => {
                return (
                  <ListItem key={f.tag}>
                    <ListItemText secondary={f.tag} />
                  </ListItem>
                )
              })
              : <ListItem>
                <ListItemText secondary="Sinulla ei ole vielä kavereita." />
              </ListItem>
            }
            <Divider />
            <ListItem
              button
              onClick={() => {
                removeUser()
                window.location.reload(true)
              }}
              component={Link}
              to="/"
            >
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="Kirjaudu ulos" />
            </ListItem>
            <ListItem button onClick={() => friendRef.current.setOpen(true)}>
              <ListItemIcon><PersonAdd /></ListItemIcon>
              <ListItemText primary="Lisää kaveri" />
            </ListItem>
          </List>
        </div>
      </SwipeableDrawer>
      <AddFriendDialog ref={friendRef} />
    </React.Fragment>
  )
})

ProfileDrawer.displayName = "ProfileDrawer"

export default ProfileDrawer