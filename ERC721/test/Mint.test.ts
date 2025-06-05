
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Minting Functionality", function () {
  it("Should mint a token and set URI", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("StandardERC721Token");
    const token = await Token.deploy("MyNFT", "MNFT");
    await token.waitForDeployment();

    await token.safeMint(addr1.address, "https://token.com/1");
    const ownerOf = await token.ownerOf(0);
    const uri = await token.tokenURI(0);

    expect(ownerOf).to.equal(addr1.address);
    expect(uri).to.equal("https://token.com/1");
  });
});
