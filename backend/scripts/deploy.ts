import { ethers } from "hardhat";

const tokens = (n: number) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const occasions = [
  {
    name: "Bachfest Leipzig",
    cost: tokens(3),
    tickets: 0,
    date: "June 8",
    time: "6:00PM EST",
    location: "Leipzig, Germany",
  },
  {
    name: "ETH Tokyo",
    cost: tokens(1),
    tickets: 125,
    date: "Jun 2",
    time: "1:00PM JST",
    location: "Tokyo, Japan",
  },
  {
    name: "ETH Privacy Hackathon",
    cost: tokens(0.25),
    tickets: 200,
    date: "Jun 9",
    time: "10:00AM TRT",
    location: "Turkey, Istanbul",
  },
  {
    name: "The Book Of Mormon - San Francisco",
    cost: tokens(2),
    tickets: 100,
    date: "Jun 11",
    time: "6:30PM PST",
    location: "Orpheum Theatre - San Francisco, CA",
  },
  {
    name: "ETH Global New York",
    cost: tokens(1.5),
    tickets: 125,
    date: "Sept 22",
    time: "11:00AM EST",
    location: "New York, United States",
  },
];

const main = async () => {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners();
  const NAME = "TokenMaster";
  const SYMBOL = "TM";

  // Deploy contract
  const TokenMaster = await ethers.getContractFactory("TokenMaster");
  const tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
  await tokenMaster.deployed();

  console.log(`TokenMaster Contract deployed at: ${tokenMaster.address}\n`);

  for (const [index, occasion] of occasions.entries()) {
    const tx = await tokenMaster
      .connect(deployer)
      .list(
        occasion.name,
        occasion.cost,
        occasion.tickets,
        occasion.date,
        occasion.time,
        occasion.location
      );

    await tx.wait();
    console.log(`Listed Event: ${index + 1}: ${occasion.name}`);
  }
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
