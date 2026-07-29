import {
  uploadFeedbackController,
} from "./upload.controller.js";

async function uploadRoutes(app) {
  app.post("/", uploadFeedbackController);
}

export default uploadRoutes;