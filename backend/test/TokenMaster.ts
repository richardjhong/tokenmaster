import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer, BigNumber } from "ethers";
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

    it("Should revert when anyone other than the contract owner/deployer tries to list an occasion", async () => {
      await expect(
        tokenMaster
          .connect(buyer)
          .list(
            OCCASION_NAME,
            OCCASION_COST,
            OCCASION_MAX_TICKETS,
            OCCASION_DATE,
            OCCASION_TIME,
            OCCASION_LOCATION
          )
      ).to.be.revertedWith("Only the contract owner can call this");
    });

    it("Should emit an OccasionCreated event with the index of the newly listed occasion", async () => {
      await expect(
        tokenMaster
          .connect(deployer)
          .list(
            OCCASION_NAME,
            OCCASION_COST,
            OCCASION_MAX_TICKETS,
            OCCASION_DATE,
            OCCASION_TIME,
            OCCASION_LOCATION
          )
      )
        .to.emit(tokenMaster, "OccasionCreated")
        .withArgs(await tokenMaster.totalOccasions());
    });
  });

  describe("Minting", () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits("1", "ether");

    beforeEach(async () => {
      const tx = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
      await tx.wait();
    });

    it("Should update ticket count", async () => {
      const occasion = await tokenMaster.getOccasion(1);
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1);
    });

    it("Should update buying status", async () => {
      const status = await tokenMaster.hasBought(ID, buyer.getAddress());
      expect(status).to.be.equal(true);
    });

    it("Should update seat status", async () => {
      const owner = await tokenMaster.seatTaken(ID, SEAT);
      expect(owner).to.be.equal(await buyer.getAddress());
    });

    it("Should update overall seating status", async () => {
      const seats = await tokenMaster.getSeatsTaken(ID);
      expect(seats.length).to.be.equal(1);
      expect(seats[0]).to.be.equal(SEAT);
    });

    it("Should update the contract balance", async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address);
      expect(balance).to.be.equal(AMOUNT);
    });
  });

  describe("Withdrawing", async () => {
    const ID = 1;
    const SEAT = 50;
    const AMOUNT = ethers.utils.parseUnits("1", "ether");
    let balanceBefore: BigNumber;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(await deployer.getAddress());

      let tx = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT });
      await tx.wait();

      tx = await tokenMaster.connect(deployer).withdraw();
      await tx.wait();
    });

    it("Should update the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(await deployer.getAddress());
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Should update the contract balance after withdrawal", async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address);
      expect(balance).to.be.equal(0);
    });

    it("Should revert when anyone other than the contract owner/deployer tries to withdraw contract funds", async () => {
      await expect(tokenMaster.connect(buyer).withdraw()).to.be.revertedWith(
        "Only the contract owner can call this"
      );
    });
  });
});
