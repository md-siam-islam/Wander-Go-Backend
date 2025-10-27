import  nodemailer from 'nodemailer';
import { envVariables } from '../../config/env';
import ejs from "ejs";
import path from "path";

// const transporter = nodemailer.createTransport({
//     // port: envVars.EMAIL_SENDER.SMTP_PORT,
//     secure: true,
//     auth: {
//         user: envVars.EMAIL_SENDER.SMTP_USER,
//         pass: envVars.EMAIL_SENDER.SMTP_PASS
//     },
//     port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
//     host: envVars.EMAIL_SENDER.SMTP_HOST
// })

const transporter = nodemailer.createTransport({
    secure : true,
    auth : {
        user : envVariables.EMAIL_SENDER.SMTP_USER,
        pass : envVariables.EMAIL_SENDER.SMTP_PASS
    },
    port : Number(envVariables.EMAIL_SENDER.SMTP_PORT),
    host : envVariables.EMAIL_SENDER.SMTP_HOST,
   
})

// interface SendEmailOptions {
//     to: string,
//     subject: string;
//     templateName: string;
//     templateData?: Record<string, any>
//     attachments?: {
//         filename: string,
//         content: Buffer | string,
//         contentType: string
//     }[]
// }

// export const sendEmail = async ({
//     to,
//     subject,
//     templateName,
//     templateData,
//     attachments
// }: SendEmailOptions) => {
//     try {
//         const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
//         const html = await ejs.renderFile(templatePath, templateData)
//         const info = await transporter.sendMail({
//             from: envVars.EMAIL_SENDER.SMTP_FROM,
//             to: to,
//             subject: subject,
//             html: html,
//             attachments: attachments?.map(attachment => ({
//                 filename: attachment.filename,
//                 content: attachment.content,
//                 contentType: attachment.contentType
//             }))
//         })
//         console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
//     } catch (error: any) {
//         console.log("email sending error", error.message);
//         throw new AppError(401, "Email error")
//     }

// }
export interface SendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData?: Record<string, any>,
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendMailer = async(
    { to, subject, templateName, templateData, attachments }
    : SendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from : envVariables.EMAIL_SENDER.SMTP_FROM_EMAIL,
            to : to,
            subject : subject,
            html : html,
            attachments : attachments?.map(attachments => ({
                filename : attachments.filename,
                content : attachments.content,
                contentType : attachments.contentType
            }))
        })
        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
        console.log("Error sending email:", error);
        throw new Error("Email sending failed");
    }
}