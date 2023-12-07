// Email Notifications Service

const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const { rabbitMQUrl, emailConfig } = require('./config.js');

const transporter = nodemailer.createTransport(emailConfig);

async function sendEmailNotification(order) {
    try {
        // Compose email based on the order details
        const emailOptions = {
            from: process.env.EMAIL,
            to: order.customerEmail,
            subject: 'Order Confirmation',
            text: `Dear ${order.customerName},\n\nYour order has been confirmed. Order ID: ${order.id}\n\nThank you for shopping with us!.`,
        };

        // Send email notification
        await transporter.sendMail(emailOptions);

        console.log('Email notification sent:', order);
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
}

async function startEmailNotificationsService() {
    try {
        const connection = await amqp.connect(rabbitMQUrl, {
            // credentials: amqp.credentials.plain(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
        });
        const channel = await connection.createChannel();

        const exchange = 'order_exchange';
        const queue = 'email-queue';
        const routingKey = 'order_queue';

        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);
        await channel.prefetch(1);

        channel.consume(queue, async (message) => {
            const order = JSON.parse(message.content.toString());
            await sendEmailNotification(order);
            channel.ack(message);
        });

        console.log('Email Notifications Service started');
    } catch (error) {
        console.error('Error starting Email Notifications Service:', error);
    }
}

startEmailNotificationsService().catch(console.error);