import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.use(errorHandler);
export default app;
