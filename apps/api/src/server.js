import app from './app.js';
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4001;
const HOST = process.env.HOST;

const startServer = async () => {
  try{
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Server running on http://${HOST}:${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();