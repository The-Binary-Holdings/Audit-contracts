// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BaseVestingERC20 {
    uint256[] public cycleToPercentage;
    address[] public investors;
    mapping(address => uint256) public investorToAmount;
    mapping(address => uint256) public claimed;
    uint256 public cliffPeriod;
    uint256 public startTime;
    uint256 public cycleDuration;
    uint256 immutable percentageDecimals = 10 ** 18;
    IERC20 public token;

    event TokensClaimed(address indexed investor, uint256 indexed amount);
    event Initialized(
        address indexed token,
        uint256[] _percentages,
        address[] _investors,
        uint256[] _allocatedAmount,
        uint256 _cliffPeriod,
        uint256 _cycleDuration,
        uint256 _startTime
    );

    function initialize(
        address _token,
        uint256[] memory _percentages,
        address[] memory _investors,
        uint256[] memory _allocatedAmount,
        uint256 _cliffPeriod,
        uint256 _cycleDuration,
        uint256 _startTime
    ) public {
        require(startTime == 0, "Already Initialized");
        require(_cycleDuration > 0, "Invalid Cycle Duration");
        require(_investors.length > 0, "Investors list cannot be empty");
        require(_percentages.length > 0, "Percentages list cannot be empty");
        require(_investors.length == _allocatedAmount.length, "Length mismatch");
        require(_startTime > block.timestamp, "Invalid start time");

        token = IERC20(_token);

        for (uint256 i = 0; i < _percentages.length; i++) {
            cycleToPercentage.push(_percentages[i]);
        }

        uint256 totalInvestment;
        for (uint256 i = 0; i < _investors.length; i++) {
            address investor = _investors[i];
            investors.push(investor);
            investorToAmount[investor] = _allocatedAmount[i];
            totalInvestment += _allocatedAmount[i];
        }

        require(token.transferFrom(msg.sender, address(this), totalInvestment), "Token transfer failed");

        cliffPeriod = _cliffPeriod;
        cycleDuration = _cycleDuration;
        startTime = _startTime;

        emit Initialized(_token, _percentages, _investors, _allocatedAmount, _cliffPeriod, _cycleDuration, _startTime);
    }

    function claim(uint256 amount) public {
        require(startTime > 0, "Vesting has not started");
        require(amount <= claimable(msg.sender), "No tokens to claim");
        claimed[msg.sender] += amount;
        require(token.transfer(msg.sender, amount), "Token transfer failed");
        emit TokensClaimed(msg.sender, amount);
    }

    function claimable(address _investor) public view returns (uint256) {
        if (startTime == 0 || block.timestamp < startTime) return 0;
        if (block.timestamp < startTime + cliffPeriod) {
            uint256 tgeAmount = (investorToAmount[_investor] * cycleToPercentage[0]) / (100 * percentageDecimals);
            return tgeAmount - claimed[_investor];
        }

        uint256 elapsedTime = block.timestamp - (startTime + cliffPeriod);
        uint256 elapsedCycles = elapsedTime / cycleDuration;
        uint256 lastCycle = cycleToPercentage.length - 1;
        uint256 parseLength = elapsedCycles >= cycleToPercentage.length ? lastCycle : elapsedCycles;
        uint256 totalVested;

        for (uint256 i = 0; i <= parseLength; i++) {
            totalVested += (investorToAmount[_investor] * cycleToPercentage[i]) / (100 * percentageDecimals);
        }

        return totalVested - claimed[_investor];
    }

    function getMonthPercentages() public view returns (uint256[] memory) {
        return cycleToPercentage;
    }

    function getInvestors() public view returns (address[] memory) {
        return investors;
    }

    function getTotalAllocatedAmount() public view returns (uint256 total) {
        for (uint256 i = 0; i < investors.length; i++) {
            total += investorToAmount[investors[i]];
        }
    }

    function getTotalClaimable() public view returns (uint256 total) {
        for (uint256 i = 0; i < investors.length; i++) {
            total += claimable(investors[i]);
        }
    }

    function getTotalClaimed() public view returns (uint256 total) {
        for (uint256 i = 0; i < investors.length; i++) {
            total += claimed[investors[i]];
        }
    }
}
