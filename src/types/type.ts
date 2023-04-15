import { ethers } from "ethers";

export type WalletGroup = {
  mumbai: ethers.Wallet;
  alfajores: ethers.Wallet;
};

export type ContractGroup = {
  mumbai: ethers.Contract;
  alfajores: ethers.Contract;
};

export type HabitInfo = {
  maxBettingPrice: BigInt;
  minBettingPrice: BigInt;
  maxParticipants: BigInt;
  failerRetrieveRatio: BigInt;
  successCondition: BigInt;
  drawCondition: BigInt;
  startTime: BigInt;
  endTime: BigInt;
};

export type CollectionInfo = {
  name: string;
  baseURI: string;
};

export enum NetworkList {
  mumbai = "mumbai",
  alfajores = "alfajores",
}

export type VerifyUnit = {
  habitId: string;
  address: string;
  index: number;
};
