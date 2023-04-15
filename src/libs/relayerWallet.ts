import { ethers } from "ethers";
import config from "../config";
import {
  CollectionInfo,
  ContractGroup,
  HabitInfo,
  NetworkList,
  VerifyUnit,
  WalletGroup,
} from "../types/type";
import contractAbi from "../contract/abi/HabitHack.json";

export default class RelayerWallet {
  relayer: WalletGroup;
  habitContract: ContractGroup;

  constructor() {
    this.relayer = this.getRelayer();
    this.habitContract = this.getContract();
  }

  getRelayer(): WalletGroup {
    const mumbaiProvider = new ethers.InfuraProvider(
      "mumbai",
      config.rpc.mumbai
    );
    const mumbaiWallet = new ethers.Wallet(
      config.relayer.privateKey,
      mumbaiProvider
    );
    const alfajoresProvider = new ethers.InfuraProvider(
      "alfajores",
      config.rpc.alfajores
    );
    const alfajoresWallet = new ethers.Wallet(
      config.relayer.privateKey,
      alfajoresProvider
    );
    return { mumbai: mumbaiWallet, alfajores: alfajoresWallet };
  }

  getContract(): ContractGroup {
    const mumbaiContract = new ethers.Contract(
      config.contract.mumbai,
      contractAbi,
      this.relayer.mumbai
    );
    const alfajoresContract = new ethers.Contract(
      config.contract.alfajores,
      contractAbi,
      this.relayer.alfajores
    );
    return { mumbai: mumbaiContract, alfajores: alfajoresContract };
  }

  async setHabit(
    _habitId: string,
    _habitInfo: HabitInfo,
    _collectionInfo: CollectionInfo,
    _network: NetworkList
  ) {
    const _contract = this.habitContract[_network];
    const tx = await _contract.habitSetting(
      _habitId,
      [
        _habitInfo.maxBettingPrice,
        _habitInfo.minBettingPrice,
        _habitInfo.maxParticipants,
        _habitInfo.failerRetrieveRatio,
        _habitInfo.successCondition,
        _habitInfo.drawCondition,
        _habitInfo.startTime,
        _habitInfo.endTime,
      ],
      _collectionInfo.name,
      _collectionInfo.baseURI
    );
    await tx.wait();
  }

  async verifyBundle(
    _moderatorAddress: string,
    _verifyBundle: VerifyUnit[],
    _network: NetworkList
  ) {
    const _contract = this.habitContract[_network];
    const tx = _contract.verifyBundle(_moderatorAddress, _verifyBundle);
    return tx;
  }

  async settle(_habitId: string, _network: NetworkList) {
    const _contract = this.habitContract[_network];
    const tx = _contract.settleWinner(_habitId);
    return tx;
  }
}
