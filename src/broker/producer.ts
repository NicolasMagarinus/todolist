import amqp from 'amqplib';

export const sendMessage = async (queue: string, message: Record<string, any>): Promise<void> => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672');
        const channel = await connection.createChannel();

        if (!message) {
            throw new Error('Message is undefined or empty');
        }
        if (!queue) {
            throw new Error('Queue name is undefined or empty');
        }

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

        console.log(`[Producer] Message sent to queue "${queue}":`, message);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('[Producer] Error:', error);
    }
};