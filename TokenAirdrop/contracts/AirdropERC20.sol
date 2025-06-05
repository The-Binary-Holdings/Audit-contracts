// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title AirdropERC20
/// @notice A gas-efficient ERC20 batch airdrop contract using inline assembly (Yul)
contract AirdropERC20 {
    error LengthMismatch();
    error TransferFromFailed();
    error TransferFailed();
    error ZeroAddress();
    error TotalMismatch();

    function airdropERC20(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAmount
    ) external {
        if (recipients.length != amounts.length) revert LengthMismatch();

        unchecked {
            uint256 length = recipients.length;
            uint256 sum;

            // transferFrom from caller to this contract
            (bool success1, ) = token.call(
                abi.encodeWithSelector(
                    0x23b872dd, // transferFrom(address,address,uint256)
                    msg.sender,
                    address(this),
                    totalAmount
                )
            );
            if (!success1) revert TransferFromFailed();

            for (uint256 i = 0; i < length; ++i) {
                address to = recipients[i];
                uint256 amt = amounts[i];

                if (to == address(0)) revert ZeroAddress();

                sum += amt;

                (bool success2, ) = token.call(
                    abi.encodeWithSelector(
                        0xa9059cbb, // transfer(address,uint256)
                        to,
                        amt
                    )
                );
                if (!success2) revert TransferFailed();
            }

            if (sum != totalAmount) revert TotalMismatch();
        }
    }
}
