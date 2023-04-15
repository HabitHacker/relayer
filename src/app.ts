import express from "express";
import dotenv from "dotenv";
import config from "./config";
import cors from "cors";
import morgan from "morgan";

const app = express();

dotenv.config();

const corsOptions = {
  origin: config.host.cors,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.listen(config.host, () => {});
