
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Ownership Checks", function () {
  it("Only owner should be able to mint", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("StandardERC721Token");
    const token = await Token.deploy("MyNFT", "MNFT");
    await token.waitForDeployment();

    await expect(token.connect(addr1).safeMint(addr1.address, "https://token.com/3"))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });
});
