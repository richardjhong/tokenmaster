import { ethers } from "hardhat";

const tokens = (n: number) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const CONTRACT_ADDRESS = "0xc5a5C42992dECbae36851359345FE25997F5C42d" || "0xaddress";

async function main() {
  const myContractFactory = await ethers.getContractFactory("TokenMaster");
  const myContract = await myContractFactory.attach(CONTRACT_ADDRESS);

  console.log(`Calling perform operation on contract: ${CONTRACT_ADDRESS}`);
  await myContract.list(
    "ETH Global New York",
    tokens(1.5),
    125,
    "Sept 22",
    "11:00AM EST",
    "New York, United States",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
