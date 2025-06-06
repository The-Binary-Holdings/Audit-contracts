// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./BaseVestingERC20.sol";

contract VestingFactory {
    address public implementation;

    event VestingCloneCreated(address indexed cloneAddress);

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function createVesting() external {
        address clone = Clones.clone(implementation);
        emit VestingCloneCreated(clone);
    }
}
