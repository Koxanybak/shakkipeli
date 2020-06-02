import React, { useState, useContext } from "react"
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@material-ui/core"
import { useUser } from "../utils/stateHooks"
import { FeedbackContext } from "../utils/context"
import Feedback from "./Feedback"

const AddFriendDialog = React.forwardRef((_, ref) => {
  const [open, setOpen] = useState(false)
  const [tag, setTag] = useState("")
  const { setFeedback } = useContext(FeedbackContext)
  const { sendReq } = useUser()

  React.useImperativeHandle(ref, () => {
    return {
      setOpen
    }
  })

  const sendFriendRequest = async () => {
    try {
      await sendReq({ variables: { tag } })
      setFeedback({ message: "Kaveripyyntö lähetetty", severity: "success" })
    } catch (e) {
      console.log("löytys vrihe")
      setFeedback({ message: e.message, severity: "error" })
    }
    setTag("")
  }

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Lisää kaveri</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kirjoita tähän kaverisi pelinimi.
          </DialogContentText>
          <TextField
            value={tag}
            label="Pelinimi"
            onChange={e => setTag(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Peruuta
          </Button>
          <Button onClick={() => sendFriendRequest()}>
            Lisää
          </Button>
        </DialogActions>
        <DialogContent>
          <Feedback />
        </DialogContent>
      </Dialog>
    </div>
  )
})

AddFriendDialog.displayName = "AddFriendDialog"

export default AddFriendDialog