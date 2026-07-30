import uploadRoutes from "../modules/upload/upload.route.js";
import themeRoutes from "../modules/theme/theme.route.js";


async function routes(app) {
    app.register(uploadRoutes, {
        prefix: "/upload",
    })
    app.register(themeRoutes, {
        prefix: "/themes",
    })
}

export default routes;
