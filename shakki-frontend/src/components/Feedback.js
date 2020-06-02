import React, { useContext } from "react"
import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { FeedbackContext } from "../utils/context"

const Feedback = () => {
  const { feedback, setFeedback } = useContext(FeedbackContext)
  /* console.log(feedback)
  console.log(feedback ? true : false) */
  /* console.log(feedback ? feedback.severity : "info") */

  return (
    <Snackbar open={feedback ? true : false} autoHideDuration={6000} onClose={() => setFeedback(null)}>
      <Alert onClose={() => setFeedback(null)} severity={feedback ? feedback.severity : "info"}>
        {feedback ? feedback.message : ""}
      </Alert>
    </Snackbar>
  )
}

export default Feedback