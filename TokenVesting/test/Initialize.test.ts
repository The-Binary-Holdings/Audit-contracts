import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20 Vesting Initialization", function () {
  let vesting: any, token: any;
  let percentages: bigint[], investors: string[], allocations: bigint[];
  const decimals = BigInt(10 ** 18);

  beforeEach(async function () {
    const [owner, user1] = await ethers.getSigners();
    percentages = [10n * decimals, 20n * decimals, 70n * decimals];
    investors = [user1.address];
    allocations = [ethers.parseEther("1000")];

    const Token = await ethers.getContractFactory("TestToken");
    token = await Token.deploy("MockToken", "MKT", ethers.parseEther("10000"));
    await token.waitForDeployment();

    const Vesting = await ethers.getContractFactory("BaseVestingERC20");
    vesting = await Vesting.deploy();
    await vesting.waitForDeployment();

    await token.approve(vesting.target, allocations[0]);
  });

  it("Should initialize correctly", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp + 100;
    await vesting.initialize(token.target, percentages, investors, allocations, 60, 30, now);

    expect(await vesting.startTime()).to.equal(now);
    expect(await vesting.token()).to.equal(token.target);
  });

  it("Should fail with mismatched lengths", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp + 100;
    await expect(
      vesting.initialize(token.target, percentages, [], allocations, 60, 30, now)
    ).to.be.revertedWith("Investors list cannot be empty");
  });

  it("Should revert if token transfer fails", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp + 100;

    const Vesting = await ethers.getContractFactory("BaseVestingERC20");
    const broken = await Vesting.deploy();
    await broken.waitForDeployment();

    await expect(
      broken.initialize(token.target, percentages, [investors[0]], allocations, 60, 30, now)
    ).to.be.rejectedWith();
  }) 
})
