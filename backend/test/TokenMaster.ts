import { ethers } from "hardhat";
import { expect } from "chai";
import { TokenMaster } from "../typechain-types";

const NAME = "TokenMaster";
const SYMBOL = "TM";

describe("TokenMaster", () => {
  let tokenMaster: TokenMaster, deployer, buyer;

  beforeEach(async () => {
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners();

    // Deploy contract
    const TokenMaster = await ethers.getContractFactory("TokenMaster");
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
    await tokenMaster.deployed();
  });

  describe("Deployment", () => {
    it("Should set the name", async () => {
      expect(await tokenMaster.name()).to.equal(NAME);
    });

    it("Should set the symbol", async () => {
      expect(await tokenMaster.symbol()).to.equal(SYMBOL);
    });
  });
});
