import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20 Vesting Factory", function () {
  it("Should deploy vesting clone and initialize with ERC20", async function () {
    const [owner, user1] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TestToken");
    const token = await Token.deploy("MockToken", "MKT", ethers.parseEther("10000"));
    await token.waitForDeployment();

    const Vesting = await ethers.getContractFactory("BaseVestingERC20");
    const base = await Vesting.deploy();
    await base.waitForDeployment();

    const Factory = await ethers.getContractFactory("VestingFactory");
    const factory = await Factory.deploy(base.target);
    await factory.waitForDeployment();

    const percentages = [10n * 10n ** 18n, 20n * 10n ** 18n, 70n * 10n ** 18n];
    const alloc = ethers.parseEther("1000");
    const now = (await ethers.provider.getBlock("latest")).timestamp + 10;

    
    const tx = await factory.createVesting();
    const receipt = await tx.wait();
    const cloneAddr = receipt?.logs[0]?.args?.cloneAddress;

    // Approve token transfer to the actual clone now
    await token.approve(cloneAddr, alloc);

    

    // Re-initialize using the new clone (simulating full flow manually for test)
    const cloneVesting = await ethers.getContractAt("BaseVestingERC20", cloneAddr);

    await cloneVesting.initialize(token.target, percentages, [user1.address], [alloc], 3, 2, now);

    await expect(cloneVesting.token()).to.eventually.equal(token.target);
    
    

    expect(await ethers.provider.getCode(cloneAddr)).to.not.equal("0x");
  });
})