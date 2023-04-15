import express from "express";
import dotenv from "dotenv";
import config from "./config";
import cors from "cors";
import morgan from "morgan";
import RelayerWallet from "./libs/relayerWallet";
import { NetworkList, VerifyUnit } from "./types/type";

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
  try {
    await _relayerWallet.setHabit(habitId, habitInfo, collectionInfo, network);
  } catch {
    return res.status(500).json({ message: "fail" });
  }
  return res.status(200).json({ message: "success" });
});

app.post("/habit/verify", async (req, res) => {
  const {
    _moderatorAddress,
    _verifyBundle,
    _network,
  }: {
    _moderatorAddress: string;
    _verifyBundle: VerifyUnit[];
    _network: NetworkList;
  } = req.body;
  const _relayerWallet = new RelayerWallet();
  try {
    await _relayerWallet.verifyBundle(
      _moderatorAddress,
      _verifyBundle,
      _network
    );
  } catch {
    res.status(500).json({ message: "fail" });
  }
  return res.status(200).json({ message: "success" });
});

app.post("/habit/settle", async (req, res) => {
  const { habitId, network } = req.body;
  const _relayerWallet = new RelayerWallet();
  try {
    await _relayerWallet.settle(habitId, network);
  } catch {
    return res.status(500).json({ message: "fail" });
  }
  return res.status(200).json({ message: "success" });
});

app.listen(config.host, () => {
  console.log("server is running on port " + config.host.port);
});
