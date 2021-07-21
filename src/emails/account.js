const sgMail = require('@sendgrid/mail');

const sendgridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridApiKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'travelyousefvisa@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}. Let us know how is your opinion about our app so far`
    });
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'travelyousefvisa@gmail.com',
        subject: 'Sorry to see you go',
        text: `Thanks for having you in our community, ${name}. Let us know how our app can be improved`
    });
}

module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendCancelEmail: sendCancelEmail
}