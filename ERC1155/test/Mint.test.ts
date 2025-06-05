
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC1155 Minting", function () {
  it("Should mint single and batch tokens", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("StandardERC1155Token");
    const token = await Token.deploy("https://token-cdn-domain/{id}.json");
    await token.waitForDeployment();

    await token.mint(addr1.address, 0, 50, "0x");
    const balance = await token.balanceOf(addr1.address, 0);
    expect(balance).to.equal(50);

    await token.mintBatch(addr1.address, [0, 1], [10, 20], "0x");
    expect(await token.balanceOf(addr1.address, 0)).to.equal(60);
    expect(await token.balanceOf(addr1.address, 1)).to.equal(20);
  });
});
