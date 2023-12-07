# Order Processing System

The Order Processing System is a distributed system that utilizes RabbitMQ message queuing to process orders, manage inventory, and send email notifications. It consists of several modules that work together to handle the entire order lifecycle.

**Please note that this is a simplified example code intended to demonstrate the basic concepts of the Order Processing System. Use it as a starting point for your own implementation and adapt it to your specific requirements.**

## Modules

### Order Placement

The Order Placement module is responsible for receiving and placing orders. It exposes an HTTP endpoint `/place-order` to accept order requests. When an order is received, it establishes a connection to RabbitMQ, publishes the order message to an exchange, and sends a response indicating the successful placement of the order.

### Order Processing Service

The Order Processing Service module processes the orders received from the Order Placement module. It establishes a connection to RabbitMQ, consumes order messages from a queue, and asynchronously processes each order. After processing an order, it acknowledges the message, indicating successful processing.

### Inventory Management Service

The Inventory Management Service module updates the inventory based on the received orders. It establishes a connection to RabbitMQ, consumes order messages from a queue, and asynchronously updates the inventory. After updating the inventory, it acknowledges the message.

### Email Notifications Service

The Email Notifications Service module sends email notifications to customers after their orders have been placed. It establishes a connection to RabbitMQ, consumes order messages from a queue, and asynchronously sends email notifications to customers. After sending the email notification, it acknowledges the message.

## Configuration

The system's configuration is stored in the `config.js` module. It exports the RabbitMQ URL and email configuration details used by the other modules. The configuration values are retrieved from environment variables defined in the `.env` file.

## Getting Started

To run the Order Processing System, follow these steps:

1. Clone the repository and navigate to the project directory.
2. Create a `.env` file and set the required environment variables, including the RabbitMQ URL and email configuration details.
3. Install the dependencies by running `npm install`.
4. Start the Order Placement module by running `node order-placement.js`.
5. Start the Order Processing Service module by running `node order-processing-service.js`.
6. Start the Inventory Management Service module by running `node inventory-management-service.js`.
7. Start the Email Notifications Service module by running `node email-notifications-service.js`.

Ensure that RabbitMQ is running and accessible with the provided URL.

Once the system is up and running, you can place orders by sending HTTP POST requests to the `/place-order` endpoint with the necessary order details in the request body.

## Example

Here's an example of how to place an order using cURL:

```shell
curl -X POST -H "Content-Type: application/json" -d '{
  "id": "123",
    "customerId": "67890", 
    "customerName": "test",
    "customerEmail": "customerEmail@test.com",
    "items": [
    {
      "product_id": "P001",
      "quantity": 2
    },
    {
      "product_id": "P002",
      "quantity": 1
    }
  ]
}' http://localhost:3000/place-order
This example places an order with the order ID "123", customer name "test", customer email "customerEmail@test.com", and two items with product IDs "P001" and "P002" along with their respective quantities.
