import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import errorHandler from "./middlewares/errorHandler.js";
import { generateOpenAPI } from "./config/openapi.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(generateOpenAPI(), { explorer: true }),
);
app.use("/api", apiRoutes);

app.use(errorHandler);
export default app;
