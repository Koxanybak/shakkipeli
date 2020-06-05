import React, { useState, useContext } from "react"
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@material-ui/core"
import { FeedbackContext } from "../utils/context"
import Feedback from "./Feedback"

const AddFriendDialog = React.forwardRef(({ sendReq }, ref) => {
  const [open, setOpen] = useState(false)
  const [tag, setTag] = useState("")
  const { setFeedback } = useContext(FeedbackContext)

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
            id="add-friend-tag"
            value={tag}
            label="Pelinimi"
            onChange={e => setTag(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} id="friend-request-cancel">
            Peruuta
          </Button>
          <Button onClick={() => sendFriendRequest()} id="friend-request-send">
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