// SPDX-License-Identifier: MIT
pragma solidity =0.6.12;

import '../libraries/SafeBEP20.sol';
import '../libraries/SafeMath.sol';

/**
 * @dev A token holder contract that will allow a beneficiary to extract the
 * tokens after a given release time.
 *
 * Useful for simple vesting schedules like "advisors get 10% of their tokens
 * monthly after 1 year".
 */
contract TokenTimelock {
    using SafeBEP20 for IBEP20;
    using SafeMath for uint256;

    // ERC20 basic token contract being held
    IBEP20 public immutable token;

    // beneficiary of tokens after they are released
    address public beneficiary;

    uint256 public immutable totalAmount;
    uint256 public immutable startedAt;
    uint256 public immutable chunkAmount;
    uint256 public immutable chunkInterval;
    uint256 public totalWithdrawn;

    constructor(
        IBEP20 _token,
        address _beneficiary,
        uint256 _totalAmount,
        uint256 _startedAt,
        uint256 _chunkAmount,
        uint256 _chunkInterval
    ) public {
        token = _token;
        beneficiary = _beneficiary;
        totalAmount = _totalAmount;
        startedAt = _startedAt;
        chunkAmount = _chunkAmount;
        chunkInterval = _chunkInterval;
    }

    function _unlockedAmountAt(uint256 _timestamp) internal view returns (uint256 _unlockedAmount) {
        if (_timestamp < startedAt) {
            return 0;
        }

        _unlockedAmount = _timestamp
            .sub(startedAt)
            .div(chunkInterval)
            .add(1) // the initial chunk will be unlocked right at the start
            .mul(chunkAmount);

        if (_unlockedAmount > totalAmount) {
            _unlockedAmount = totalAmount;
        }
    }

    function setBeneficiary(address _beneficiary) public {
        require(_beneficiary != address(0), 'TokenTimelock: cannot be zero address');
        require(msg.sender == beneficiary, 'TokenTimelock: unauthorized');
        beneficiary = _beneficiary;
    }

    function unlockedAmount() public view returns (uint256) {
        return _unlockedAmountAt(block.timestamp);
    }

    /**
     * @notice Transfers tokens held by timelock to beneficiary.
     */
    function withdraw() public {
        uint256 _unlockedAmount = _unlockedAmountAt(block.timestamp);
        require(_unlockedAmount > totalWithdrawn, 'TokenTimelock: no tokens to release');
        uint256 amount = _unlockedAmount.sub(totalWithdrawn);
        token.safeTransfer(beneficiary, amount);
        totalWithdrawn = _unlockedAmount;
    }
}
