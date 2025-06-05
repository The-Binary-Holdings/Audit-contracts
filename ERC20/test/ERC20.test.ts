
import { expect } from "chai";
import { ethers } from "hardhat";

describe("StandardERC20Token - ERC20", function () {
  it("Should return the correct name and symbol", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("StandardERC20Token");
    const token = await Token.deploy("MyToken", "MTK", ethers.parseEther("1000"), owner.address);
    await token.waitForDeployment();

    expect(await token.name()).to.equal("MyToken");
    expect(await token.symbol()).to.equal("MTK");
  });

  it("Should assign the initial supply to the admin", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("StandardERC20Token");
    const token = await Token.deploy("MyToken", "MTK", ethers.parseEther("1000"), owner.address);
    await token.waitForDeployment();

    const balance = await token.balanceOf(owner.address);
    expect(balance.toString()).to.equal(ethers.parseEther("1000").toString());
  });
});
