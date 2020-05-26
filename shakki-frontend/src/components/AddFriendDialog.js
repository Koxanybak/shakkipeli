import React, { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@material-ui/core"

const AddFriendDialog = React.forwardRef((_, ref) => {
  const [open, setOpen] = useState(false)
  const [tag, setTag] = useState("")

  React.useImperativeHandle(ref, () => {
    return {
      setOpen
    }
  })

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
        <DialogTitle>Lisää kaveri</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kirjoita tähän kaverisi pelinimi.
          </DialogContentText>
          <TextField
            label="Pelinimi"
            onChange={e => setTag(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Peruuta
          </Button>
          <Button>
            Lisää
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

AddFriendDialog.displayName = "AddFriendDialog"

export default AddFriendDialog