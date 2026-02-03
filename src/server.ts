import app from "./app";
import { env } from "./config/env";
import { connectDb } from "./config/db";

async function bootstrap() {
    await connectDb();
    app.listen(env.PORT, () => {
        console.log(`✅ SANAD API running on port ${env.PORT}`);
    });
}

bootstrap().catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
});
