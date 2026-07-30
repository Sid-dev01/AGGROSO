import uploadRoutes from "../modules/upload/upload.route.js";
import themeRoutes from "../modules/theme/theme.route.js";
import reportRoutes from "../modules/report/report.route.js";


async function routes(app) {
    app.register(uploadRoutes, {
        prefix: "/upload",
    })
    app.register(themeRoutes, {
        prefix: "/themes",
    })
    app.register(reportRoutes, {
        prefix: "/reports",
    })
}

export default routes;
