import express from "express";
import dotenv from "dotenv";
import config from "./config";
import cors from "cors";
import morgan from "morgan";
import RelayerWallet from "./libs/relayerWallet";
import { NetworkList, VerifyUnit } from "./types/type";
import { ethers } from "ethers";

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

app.post("/signature/moderator", async (req, res) => {
  const { address, network }: { address: string; network: NetworkList } =
    req.body;
  const _relayerWallet = new RelayerWallet();
  const _walletGroup = _relayerWallet.getRelayer();
  const _wallet = _walletGroup[network];
  const resisterHash = ethers.solidityPackedKeccak256(
    ["uint256"],
    [BigInt(address)]
  );
  const _signature = await _wallet.signMessage(ethers.toBeArray(resisterHash));
  return res.status(200).json({ signature: _signature });
});

//A router that synchronizes all chains when a modulator is registered in one chain
app.post("/moderator/register", async (req, res) => {
  const {
    address,
    assignedNetwork,
  }: { address: string; assignedNetwork: NetworkList } = req.body;
  const _contractList = new RelayerWallet().getContract();
  for (let _network in NetworkList) {
    if (_network === assignedNetwork) continue;
    const _contract = _contractList[_network as NetworkList];
    await _contract.resisterOtherChainModerator(address);
  }
});

app.listen(config.host, () => {
  console.log("server is running on port " + config.host.port);
});
