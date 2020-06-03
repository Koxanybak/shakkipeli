import React, { useState, useImperativeHandle, } from "react"
import { SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Link, Divider, IconButton, } from "@material-ui/core"
import { ExitToApp, PersonAdd, Check, Close, SportsEsports, } from "@material-ui/icons"
import AddFriendDialog from "./AddFriendDialog"
import { useUser, useFriends } from "../utils/stateHooks"

const ProfileDrawer = React.forwardRef((_, ref) => {
  const [show, setShow] = useState(false)
  const {
    user,
    removeUser,
  } = useUser()
  const {
    acceptReq,
    declineReq,
    sendGameInv,
    resolveGameInv,
    sendReq,
  } = useFriends(user)
  const friendRef = React.createRef()

  const openDrawer = () => {
    setShow(true)
  }

  useImperativeHandle(ref, () => {
    return {
      openDrawer
    }
  })

  const sendInvite = async tag => {
    if (!user.receivedInvites || !user.receivedInvites.find(inv => inv.from === tag)) {
      await sendGameInv({ variables: { tag } })
    }
  }

  const resolveInvite = async (from, accepted) => {
    try {
      await resolveGameInv({ variables: { from, accepted, } })
    } catch (e) {
      console.log(e.message)
    }
  }

  if (user && user.guest) {
    return null
  }

  //console.log("ProfileDrawer is rendered and invs are", receivedInvs)

  return (
    <React.Fragment>
      <SwipeableDrawer
        open={show}
        onClose={() => setShow(false)}
        onOpen={() => setShow(true)}
        anchor="right"
      >
        <div style={{ width: "32vh" }}>
          <List>
            <ListItem>
              <ListItemText primary={user ? `Kirjautuneena ${user.tag}` : null} />
            </ListItem>
            <Divider />
            {user && user.receivedRequests.length !== 0
              ? <React.Fragment>
                <ListItem>
                  <ListItemText primary="Kaveripyynnöt" />
                </ListItem>
                {user.receivedRequests.map(req => {
                  return (
                    <ListItem key={req.id}>
                      <ListItemText secondary={`Käyttäjältä ${req.from.tag}`} />
                      <IconButton onClick={() => acceptReq({ variables: { requestId: req.id } })}>
                        <Check />
                      </IconButton>
                      <IconButton onClick={() => declineReq({ variables: { requestId: req.id } })}>
                        <Close />
                      </IconButton>
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
                    <IconButton onClick={() => sendInvite(f.tag)}>
                      <SportsEsports />
                    </IconButton>
                  </ListItem>
                )
              })
              : <ListItem>
                <ListItemText secondary="Sinulla ei ole vielä kavereita." />
              </ListItem>
            }
            <Divider />
            <ListItem>
              <ListItemText primary="Lähetetyt pelikutsut" />
            </ListItem>
            {(user && user.sentInvites) ? user.sentInvites.map(inv => {
              return (
                <ListItem key={inv.to}>
                  <ListItemText secondary={`käyttäjälle ${inv.to}`} />
                </ListItem>
              )
            }) : null}
            <Divider />
            <ListItem>
              <ListItemText primary="Vastaanotetut pelikutsut" />
            </ListItem>
            {(user && user.receivedInvites) ? user.receivedInvites.map(inv => {
              return (
                <ListItem key={inv.from}>
                  <ListItemText secondary={`käyttäjältä ${inv.from}`} />
                  <IconButton onClick={() => resolveInvite(inv.from, true)}>
                    <Check />
                  </IconButton>
                  <IconButton onClick={() => resolveInvite(inv.from, false)}>
                    <Close />
                  </IconButton>
                </ListItem>
              )
            }) : null}
            <Divider />
            <ListItem
              button
              onClick={() => {
                removeUser()
                console.log("has been removed")
                setShow(false)
                window.location.reload()
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
            <ListItem>
              <ListItemText secondary="Huom. kaverilistassa ei näy, onko kaveri paikalla shakkipelissä,
              ja pelikutsu ei saavu perille hänen ollessa poissa.
              Kaveripyynnön lähettäminen onnistuu kyllä, vaikka hän ei olisi paikalla." />
            </ListItem>
          </List>
        </div>
      </SwipeableDrawer>
      <AddFriendDialog sendReq={sendReq} ref={friendRef} />
    </React.Fragment>
  )
})

ProfileDrawer.displayName = "ProfileDrawer"

export default ProfileDrawer