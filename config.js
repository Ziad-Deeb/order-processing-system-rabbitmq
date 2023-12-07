require('dotenv').config();

module.exports = {
    rabbitMQUrl: process.env.RABBITMQ_URL,
    emailConfig: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }
};