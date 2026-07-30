import fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
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

await app.register(swagger, {
    openapi: {
        info: {
            title: "Feedback Synthesis Assistant API",
            description: "Fastify API for feedback upload, AI theme review, and report generation.",
            version: "1.0.0",
        },
    },
})

await app.register(swaggerUi, {
    routePrefix: "/documentation",
})

app.get("/health", {
    schema: {
        tags: ["Health"],
        summary: "Check API and database health",
        response: {
            200: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    database: { type: "string" },
                },
            },
            500: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    database: { type: "string" },
                },
            },
        },
    },
}, async (request, reply) => {
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
