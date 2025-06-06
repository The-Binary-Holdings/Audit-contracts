
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20 Vesting Claim", function () {
  let vesting: any, token: any, user: any;
  const decimals = BigInt(10 ** 18);
  const allocation = ethers.parseEther("1000");

  beforeEach(async function () {
    const [owner, user1] = await ethers.getSigners();
    user = user1;
    const now = (await ethers.provider.getBlock("latest")).timestamp + 5;

    const Token = await ethers.getContractFactory("TestToken");
    token = await Token.deploy("MockToken", "MKT", ethers.parseEther("10000"));
    await token.waitForDeployment();

    const Vesting = await ethers.getContractFactory("BaseVestingERC20");
    vesting = await Vesting.deploy();
    await vesting.waitForDeployment();

    await token.approve(vesting.target, allocation);

    const percentages = [10n * decimals, 20n * decimals, 70n * decimals];
    await vesting.initialize(token.target, percentages, [user.address], [allocation], 3, 2, now);
  });

  it("Should allow user to claim tokens after cliff", async function () {
    await ethers.provider.send("evm_increaseTime", [6]);
    await ethers.provider.send("evm_mine");

    const claimable = await vesting.claimable(user.address);
    await token.connect(user).approve(vesting.target, claimable); // not needed but for completeness

    await expect(() => vesting.connect(user).claim(claimable)).to.changeTokenBalances(
      token,
      [vesting, user],
      [claimable * -1n, claimable]
    );
  });

  it("Should revert if trying to claim more than claimable", async function () {
    await ethers.provider.send("evm_increaseTime", [6]);
    await ethers.provider.send("evm_mine");

    const claimable = await vesting.claimable(user.address);
    await expect(vesting.connect(user).claim(claimable + 1n)).to.be.revertedWith("No tokens to claim");
  });
});
