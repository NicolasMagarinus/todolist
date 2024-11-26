import amqp from 'amqplib';

export const consumeMessages = async (queue: string): Promise<void> => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672');
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: true });
        console.log(`[Consumer] Connected to queue "${queue}". Waiting for messages...`);

        channel.consume(queue, (msg) => {
            try {
                if (msg !== null) {
                    const message = JSON.parse(msg.content.toString());
                    console.log(`[Consumer] Received message:`, message);

                    switch (queue) {
                        case 'task_created':
                            console.log('Process task created:', message);
                            break;

                        case 'task_updated':
                            console.log('Process task updated:', message);
                            break;

                        case 'task_deleted':
                            console.log('Process task deleted:', message);
                            break;

                        default:
                            console.log('Unhandled message type:', message);
                    }

                    channel.ack(msg);
                }
            } catch (error) {
                console.error(`[Consumer] Error processing message:`, error);
            }
        });
    } catch (error) {
        console.error('[Consumer] Error:', error);
    }
};
