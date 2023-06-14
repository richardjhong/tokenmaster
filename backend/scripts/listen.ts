import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xc5a5C42992dECbae36851359345FE25997F5C42d" || "0xaddress";

export default async function listen() {
  const myContractFactory = await ethers.getContractFactory("TokenMaster");
  const myContract = await myContractFactory.attach(CONTRACT_ADDRESS);

  console.log(`Listening to events from contract: ${CONTRACT_ADDRESS}`);
  myContract.on("OccasionCreated", (occasion) => {
    console.log(`Received occasion ${occasion}`);
  });
}

listen();
