import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = async recipient => {
    const msg = {
      to: recipient,
      from: "haglea@icloud.com",
      subject: "New blog post",
      text: "new blog post was created",
      html: "<strong>new blog post was created</strong>",
    }
  
    await sgMail.send(msg)
  }