import { expect } from "chai";
import { ethers } from "hardhat";

describe("AirdropERC20", function () {
  it("Should airdrop ERC20 tokens correctly", async function () {
    const [owner, user1, user2] = await ethers.getSigners();

    const ERC20 = await ethers.getContractFactory("TestToken");
    const token = await ERC20.deploy("TestToken", "TTK", ethers.parseUnits("10000", 18));
    await token.waitForDeployment();

    const Airdrop = await ethers.getContractFactory("AirdropERC20");
    const airdrop = await Airdrop.deploy();
    await airdrop.waitForDeployment();

    // Approve the airdrop contract
    await token.approve(airdrop.target, ethers.parseUnits("3000", 18));

    const recipients = [user1.address, user2.address];
    const amounts = [ethers.parseUnits("1000", 18), ethers.parseUnits("2000", 18)];
    const total = ethers.parseUnits("3000", 18);

    await airdrop.airdropERC20(token.target, recipients, amounts, total);

    expect(await token.balanceOf(user1.address)).to.equal(amounts[0]);
    expect(await token.balanceOf(user2.address)).to.equal(amounts[1]);
  });
});
