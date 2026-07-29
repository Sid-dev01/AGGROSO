import fastify from 'fastify';


const app = fastify({
    logger:{
        transport:{
            target: "pino-pretty",
        },
    },
})

app.get("/health", async () => {
    return {
        success: true,
        message: "Backend is running",
    }
})

export default app;