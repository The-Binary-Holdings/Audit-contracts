
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC1155 Burn", function () {
  it("Should allow burning tokens", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("StandardERC1155Token");
    const token = await Token.deploy("https://token-cdn-domain/{id}.json");
    await token.waitForDeployment();

    await token.burn(owner.address, 0, 100);
    expect(await token.balanceOf(owner.address, 0)).to.equal(900);
  });
});
