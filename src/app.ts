import express from "express";
import dotenv from "dotenv";
import config from "./config";
import cors from "cors";
import morgan from "morgan";
import RelayerWallet from "./libs/relayerWallet";

const app = express();

dotenv.config();

const corsOptions = {
  origin: config.host.cors,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.post("/habit/setting", async (req, res) => {
  const { habitId, habitInfo, collectionInfo, network } = req.body;
  const _relayerWallet = new RelayerWallet();
  await _relayerWallet.setHabit(habitId, habitInfo, collectionInfo, network);
});

app.post("/habit/verify", (req, res) => {});

app.post("/habit/settle", (req, res) => {});

app.listen(config.host, () => {});
