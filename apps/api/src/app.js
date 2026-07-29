import fastify from 'fastify';
import routes from './routes/index.js';
import prisma from './config/prisma.js';
import multipart from '@fastify/multipart';
import errorHandler from './middlewares/errorHandler.js';


const app = fastify({
    logger:{
        transport:{
            target: "pino-pretty",
        },
    },
})

await app.register(multipart, {
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
    }
})

app.get("/health", async (request, reply) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return {
            success: true,
            message: "Backend is running",
            database: "connected",
        }
    } catch (error) {
        app.log.error(error);

        reply.status(500);

        return {
            success: false,
            message: "Database Connection failed",
            database: "disconnected",
        }
    }
})

await app.register(routes);

app.setErrorHandler(errorHandler);

export default app;