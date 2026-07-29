import uploadRoutes from "../modules/upload/upload.route.js";


async function routes(app) {
    app.register(uploadRoutes, {
        prefix: "/upload",
    })
}

export default routes;