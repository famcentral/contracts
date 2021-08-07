// SPDX-License-Identifier: MIT
pragma solidity =0.6.12;

import '../libraries/SafeBEP20.sol';
import '../libraries/SafeMath.sol';

/**
 * @dev A token holder contract that will allow a beneficiary to extract the
 * tokens after a given release time.
 */
contract PrivateTokenTimelock {
    using SafeBEP20 for IBEP20;
    using SafeMath for uint256;

    // ERC20 basic token contract being held
    IBEP20 public immutable token;

    // beneficiary of tokens after they are released
    address public beneficiary;
    uint256 public totalWithdrawn;

    constructor(IBEP20 _token, address _beneficiary) public {
        token = _token;
        beneficiary = _beneficiary;
    }

    function _linearlyUnlockedAt(
        uint256 _timestamp,
        uint256 _totalAmount,
        uint256 _startedAt,
        uint256 _chunkAmount,
        uint256 _chunkInterval
    ) internal pure returns (uint256 _unlockedAmount) {
        if (_timestamp < _startedAt) {
            return 0;
        }

        _unlockedAmount = _timestamp
            .sub(_startedAt)
            .div(_chunkInterval)
            .add(1) // the initial chunk will be unlocked right at the start
            .mul(_chunkAmount);

        if (_unlockedAmount > _totalAmount) {
            _unlockedAmount = _totalAmount;
        }
    }

    function _withDecimals(uint256 _withoutDecimals) internal pure returns (uint256 _amount) {
        return _withoutDecimals * uint256(10)**18;
    }

    // Year 2021, 2.5M tokens. Vest 10% per Month from Aug-2021
    function unlockedAllocation2021At(uint256 _timestamp) public pure returns (uint256 _unlockedAmount) {
        return
            _linearlyUnlockedAt(
                _timestamp,
                _withDecimals(2500000),
                1627750800, // Sun Aug 01 2021 00:00:00 GMT+0700
                _withDecimals(250000),
                30 days
            );
    }

    // Year 2022, 1.5M tokens. Vest 10% per Month from Jan-2022
    function unlockedAllocation2022At(uint256 _timestamp) public pure returns (uint256 _unlockedAmount) {
        return
            _linearlyUnlockedAt(
                _timestamp,
                _withDecimals(1500000),
                1640970000, // Sat Jan 01 2022 00:00:00 GMT+0700
                _withDecimals(150000),
                30 days
            );
    }

    // Year 2023, 1M tokens. Vest 10% per Month from Jan-2023
    function unlockedAllocation2023At(uint256 _timestamp) public pure returns (uint256 _unlockedAmount) {
        return
            _linearlyUnlockedAt(
                _timestamp,
                _withDecimals(1000000),
                1672506000, // Sun Jan 01 2023 00:00:00 GMT+0700
                _withDecimals(100000),
                30 days
            );
    }

    // Year 2024, 1M tokens. Vest 10% per Month from Jan-2024
    function unlockedAllocation2024At(uint256 _timestamp) public pure returns (uint256 _unlockedAmount) {
        return
            _linearlyUnlockedAt(
                _timestamp,
                _withDecimals(1000000),
                1704042000, // Mon Jan 01 2024 00:00:00 GMT+0700
                _withDecimals(100000),
                30 days
            );
    }

    function unlockedAmountAt(uint256 _timestamp) public pure returns (uint256) {
        return
            unlockedAllocation2021At(_timestamp)
                .add(unlockedAllocation2022At(_timestamp))
                .add(unlockedAllocation2023At(_timestamp))
                .add(unlockedAllocation2024At(_timestamp));
    }

    function unlockedAmount() public view returns (uint256) {
        return unlockedAmountAt(block.timestamp);
    }

    /**
     * @notice Transfers tokens held by timelock to beneficiary.
     */
    function withdraw() public {
        uint256 _unlockedAmount = unlockedAmountAt(block.timestamp);
        require(_unlockedAmount > totalWithdrawn, 'PrivateTokenTimelock: no tokens to release');
        uint256 amount = _unlockedAmount.sub(totalWithdrawn);
        token.safeTransfer(beneficiary, amount);
        totalWithdrawn = _unlockedAmount;
    }

    function setBeneficiary(address _beneficiary) public {
        require(_beneficiary != address(0), 'PrivateTokenTimelock: cannot be zero address');
        require(msg.sender == beneficiary, 'PrivateTokenTimelock: unauthorized');
        beneficiary = _beneficiary;
    }
}
