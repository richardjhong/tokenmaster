import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { TokenMaster } from "../typechain-types";

const NAME = "TokenMaster";
const SYMBOL = "TM";

const OCCASION_NAME = "ETH Texas";
const OCCASION_COST = ethers.utils.parseUnits("1", "ether");
const OCCASION_MAX_TICKETS = 100;
const OCCASION_DATE = "Apr 27";
const OCCASION_TIME = "10:00AM CST";
const OCCASION_LOCATION = "Austin, Texas";

describe("TokenMaster", () => {
  let tokenMaster: TokenMaster, deployer: Signer, buyer: Signer;

  beforeEach(async () => {
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners();

    // Deploy contract
    const TokenMaster = await ethers.getContractFactory("TokenMaster");
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);

    // Create an occasion
    const tx = await tokenMaster
      .connect(deployer)
      .list(
        OCCASION_NAME,
        OCCASION_COST,
        OCCASION_MAX_TICKETS,
        OCCASION_DATE,
        OCCASION_TIME,
        OCCASION_LOCATION
      );

    await tx.wait();
  });

  describe("Deployment", () => {
    it("Should set the name", async () => {
      expect(await tokenMaster.name()).to.equal(NAME);
    });

    it("Should set the symbol", async () => {
      expect(await tokenMaster.symbol()).to.equal(SYMBOL);
    });

    it("Should set the owner of the contract", async () => {
      expect(await tokenMaster.owner()).to.equal(await deployer.getAddress());
    });
  });

  describe("Occasions", () => {
    it("Should update the totalOccasions count", async () => {
      const beginningTotalOccasions = await tokenMaster.totalOccasions();
      expect(beginningTotalOccasions).to.be.equal(1);
    });

    it("Should return the attributes with an Occasion", async () => {
      const occasion = await tokenMaster.getOccasion(1);
      expect(occasion.id).to.be.equal(1);
      expect(occasion.name).to.be.equal(OCCASION_NAME);
      expect(occasion.cost).to.be.equal(OCCASION_COST);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS);
      expect(occasion.maxTickets).to.be.equal(OCCASION_MAX_TICKETS);
      expect(occasion.date).to.be.equal(OCCASION_DATE);
      expect(occasion.time).to.be.equal(OCCASION_TIME);
      expect(occasion.location).to.be.equal(OCCASION_LOCATION);
    });
  });
});
