const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const { initializeSocket } = require('./socket');

const DEFAULT_PORT = 3000;
const MAX_PORT_RETRIES = 5;
const initialPort = Number(process.env.PORT) || DEFAULT_PORT;

function registerShutdown(server) {
    const shutdown = async (signal) => {
        console.log(`${signal} received. Shutting down gracefully...`);

        server.close(async () => {
            try {
                if (mongoose.connection.readyState !== 0) {
                    await mongoose.connection.close();
                }
            } catch (error) {
                console.error('Error while closing MongoDB connection:', error.message);
            } finally {
                process.exit(0);
            }
        });
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
}

function startServer(port, attempt = 0) {
    const server = http.createServer(app);
    initializeSocket(server);

    const handleError = (error) => {
        if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_RETRIES) {
            const nextPort = port + 1;
            console.warn(`Port ${port} is already in use. Retrying on port ${nextPort}...`);
            startServer(nextPort, attempt + 1);
            return;
        }

        if (error.code === 'EADDRINUSE') {
            console.error(`Unable to start server. Checked ports ${initialPort} to ${port}.`);
        } else {
            console.error('Failed to start server:', error);
        }

        process.exit(1);
    };

    server.once('error', handleError);

    server.listen(port, () => {
        server.off('error', handleError);
        registerShutdown(server);
        console.log(`Server is running on port ${port}`);
    });
}

startServer(initialPort);
