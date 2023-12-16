import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import { PRIVATE_KEY, APIKEY, INFURA_API_KEY } from "./.env.json";

export default {
  etherscan: {
    apiKey: APIKEY,
  },
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "paris",
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
};
