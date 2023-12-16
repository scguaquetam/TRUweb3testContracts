import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import { PRIVATE_KEY, APIKEY, INFURA_API_KEY } from "./.env.json"

const config: HardhatUserConfig = {
  solidity: "0.8.20",
};

export default config;
