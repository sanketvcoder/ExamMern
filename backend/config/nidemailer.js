import nodemailer from 'nodemailer'
import { pass, user } from "./config.js"

const transporter = nodemailer.createTransport({
    host:'smtp-relay.brevo.com',
    port:587,
    auth:{
        user:user,
        pass:pass
    }
})
export default transporter