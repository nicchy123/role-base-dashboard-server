import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { globalErrorhandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorhandler);
export default app;
