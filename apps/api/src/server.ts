import { buildApp } from "./app.js";

const app = buildApp();

async function start(): Promise<void> {
  try {
    await app.listen({
      port: 3001,
      host: "0.0.0.0",
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void start();
