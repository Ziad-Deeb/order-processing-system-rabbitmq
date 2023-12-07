// Order Placement

const express = require('express');
const amqp = require('amqplib');
const { rabbitMQUrl } = require('./config.js');

const app = express();
app.use(express.json());

const exchange = 'order_exchange';
const routingKey = 'order_queue';

app.post('/place-order', async (req, res) => {
    try {
        const order = req.body;

        const connection = await amqp.connect(rabbitMQUrl, {
            // credentials: amqp.credentials.plain(RABBITMQ_USERNAME, RABBITMQ_PASSWORD)
        });
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(order)), { persistent: true });

        console.log('Order placed:', order);

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});