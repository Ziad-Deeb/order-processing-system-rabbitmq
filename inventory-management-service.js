// Inventory Management Service

const amqp = require('amqplib');
const { rabbitMQUrl } = require('./config.js');

async function updateInventory(order) {
    try {
        // Update inventory based on the order
        console.log('Updating inventory:', order);
        // Reduce quantities of ordered items, handle inventory synchronization, etc.

        console.log('Inventory updated successfully');
    } catch (error) {
        console.error('Error updating inventory:', error);
    }
}

async function startInventoryManagementService() {
    try {
        const connection = await amqp.connect(rabbitMQUrl, {
            // credentials: amqp.credentials.plain(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
        });
        const channel = await connection.createChannel();

        const exchange = 'order_exchange';
        const queue = 'inventory_queue';
        const routingKey = 'order_queue';

        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);
        await channel.prefetch(1);

        channel.consume(queue, async (message) => {
            const order = JSON.parse(message.content.toString());
            await updateInventory(order);
            channel.ack(message);
        });

        console.log('Inventory Management Service started');
    } catch (error) {
        console.error('Error starting Inventory Management Service:', error);
    }
}

startInventoryManagementService().catch(console.error);