import express from "express"
import { sendEmail } from "../../lib/email.js"

const usersRouter = express.Router()

usersRouter.post("/sendEmail", async (req, res, next) => {
    const { email } = req.body  
    // send email  
    await sendEmail(email)  
    // send proper response  
    res.send("Email Sent!")
  })

export default usersRouter