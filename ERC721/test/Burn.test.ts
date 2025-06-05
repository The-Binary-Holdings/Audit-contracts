
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Burning Functionality", function () {
  it("Should allow owner to burn their token", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("StandardERC721Token");
    const token = await Token.deploy("MyNFT", "MNFT");
    await token.waitForDeployment();

    await token.safeMint(owner.address, "https://token.com/2");
    await token.burn(0);

    await expect(token.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID");
  });
});
