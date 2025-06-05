
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC1155 Ownership", function () {
  it("Should restrict minting to owner only", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("StandardERC1155Token");
    const token = await Token.deploy("https://token-cdn-domain/{id}.json");
    await token.waitForDeployment();

    await expect(token.connect(addr1).mint(addr1.address, 0, 10, "0x"))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });
});
