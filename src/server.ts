import { connect } from "mongoose";
import app from "./app";
import config from "./app/config/config";
import { Server } from "http";

let server: Server;

async function run() {
  try {
    await connect(config.db_url as string);
    server = app.listen(config.port, () => {
      console.log(`Server: http://localhost:${Number(config.port)}`);
    });
  } catch (error) {
    console.log(error);
  }
}

process.on("unhandledRejection", () => {
  console.log(`unhandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`uncaughtException is detected , shutting down ...`);
  process.exit(1);
});

(async () => {
  await run();
})();
