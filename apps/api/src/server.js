import dotenv from "dotenv";
dotenv.config();
import app from './app.js';


const PORT = process.env.PORT || 4001;
const HOST = process.env.HOST;

const startServer = async () => {
  try{
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    app.log.info(`Server running on http://${HOST}:${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();