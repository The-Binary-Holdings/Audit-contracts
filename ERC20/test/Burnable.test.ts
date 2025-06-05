
import { expect } from "chai";
import { ethers } from "hardhat";

describe("StandardERC20Token - Burnable", function () {
  it("Should burn tokens correctly", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("StandardERC20Token");
    const token = await Token.deploy("MyToken", "MTK", ethers.parseEther("1000"), owner.address);
    await token.waitForDeployment();

    await token.burn(ethers.parseEther("100"));
    const balance = await token.balanceOf(owner.address);
    expect(balance.toString()).to.equal(ethers.parseEther("900").toString());
  });
});
