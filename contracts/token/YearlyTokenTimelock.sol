// SPDX-License-Identifier: MIT
pragma solidity =0.6.12;

import '../libraries/SafeBEP20.sol';
import '../libraries/SafeMath.sol';

/**
 * @dev A token holder contract that will allow a beneficiary to extract the
 * tokens after a given release time.
 *
 * Useful for simple vesting schedules like "advisors get 10 tokens at year 1
 * 20 tokens at year 2".
 */
contract YearlyTokenTimelock {
    using SafeBEP20 for IBEP20;
    using SafeMath for uint256;

    // ERC20 basic token contract being held
    IBEP20 public immutable token;

    // beneficiary of tokens after they are released
    address public beneficiary;

    uint256 public immutable startedAt;
    uint256[] public unlockAmounts;

    constructor(
        IBEP20 _token,
        address _beneficiary,
        uint256 _startedAt,
        uint256[] memory _unlockAmounts
    ) public {
        token = _token;
        beneficiary = _beneficiary;
        startedAt = _startedAt;
        unlockAmounts = _unlockAmounts;
    }

    function setBeneficiary(address _beneficiary) public {
        require(_beneficiary != address(0), 'TokenTimelock: cannot be zero address');
        require(msg.sender == beneficiary, 'TokenTimelock: unauthorized');
        beneficiary = _beneficiary;
    }

    /**
     * @notice Transfers tokens held by timelock to beneficiary.
     */
    function withdraw(uint yearsAfter) public {
        require(yearsAfter < unlockAmounts.length, 'YearlyTokenTimelock: invalid year');
        require(block.timestamp >= (startedAt + yearsAfter * 365 days), 'YearlyTokenTimelock: no tokens to release');
        uint256 amount = unlockAmounts[yearsAfter];
        require(amount > 0, 'YearlyTokenTimelock: withdrawn');
        token.safeTransfer(beneficiary, amount);
        unlockAmounts[yearsAfter] = 0;
    }
}
