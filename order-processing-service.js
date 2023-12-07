// Order Processing Service

const amqp = require('amqplib');
const { rabbitMQUrl } = require('./config.js');

async function startOrderProcessingService() {
    try {
        const connection = await amqp.connect(rabbitMQUrl, {
            // credentials: amqp.credentials.plain(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
        });
        const channel = await connection.createChannel();

        const exchange = 'order_exchange';
        const queue = 'orderProcessor';
        const routingKey = 'order_queue';

        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);
        await channel.prefetch(1);

        channel.consume(queue, async (message) => {
            const order = JSON.parse(message.content.toString());
            console.log(`Processing order: ${order.id}`);

            await processOrder(order);

            channel.ack(message);
        });

        console.log('Order Processing Service started');
    } catch (error) {
        console.error('Error starting Order Processing Service:', error);
    }
}

async function processOrder(order) {
    // Perform payment verification, inventory reservation, etc.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`Order processed: ${order.id}`);
}


startOrderProcessingService().catch(console.error);