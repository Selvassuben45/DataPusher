// src/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail', // or your SMTP provider
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_email_password_or_app_password'
            }
        });

        let info = await transporter.sendMail({
            from: '"Admin" <selvassuben13@gmail.com>',
            to: to,
            subject: subject,
            html: html
        });

        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
