import React, { useState, useImperativeHandle } from "react"
import { SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Button } from "@material-ui/core"
import { ExitToApp, PersonAdd } from "@material-ui/icons"
import AddFriendDialog from "./AddFriendDialog"

const ProfileDrawer = React.forwardRef((_, ref) => {
  const [show, setShow] = useState(false)
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
            <ListItem button>
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