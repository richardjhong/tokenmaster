import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "dotenv/config";

const QUICKNODE_HTTP_URL = process.env.QUICKNODE_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: QUICKNODE_HTTP_URL,
      accounts: [PRIVATE_KEY!],
    },
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY!,
    },
  },
};

export default config;
