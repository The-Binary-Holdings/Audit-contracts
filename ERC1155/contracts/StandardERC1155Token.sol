// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StandardERC1155Token is ERC1155, ERC1155Burnable, Ownable {
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;

    constructor(string memory uri_) ERC1155(uri_) {
        _mint(msg.sender, GOLD, 1000, "");
        _mint(msg.sender, SILVER, 2000, "");
    }

    function mint(address to, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(to, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
}
