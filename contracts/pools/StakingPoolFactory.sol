// SPDX-License-Identifier: MIT
pragma solidity =0.6.12;

import '../libraries/Ownable.sol';
import './StakingPoolInitializable.sol';

contract StakingPoolFactory is Ownable {
    event NewStakingPoolContract(address indexed stakingPool);

    constructor() public {
        //
    }

    /*
     * @notice Deploy the pool
     * @param _stakedToken: staked token address
     * @param _rewardToken: reward token address
     * @param _rewardFrom: address to transfer reward from
     * @param _rewardPerBlock: reward per block (in rewardToken)
     * @param _startBlock: start block
     * @param _endBlock: end block
     * @param _poolLimitPerUser: pool limit per user in stakedToken (if any, else 0)
     * @param _admin: admin address with ownership
     * @return address of new smart chef contract
     */
    function deployPool(
        IBEP20 _stakedToken,
        IBEP20 _rewardToken,
        address _rewardFrom,
        uint256 _rewardPerBlock,
        uint256 _startBlock,
        uint256 _bonusEndBlock,
        uint256 _poolLimitPerUser,
        address _admin
    ) external onlyOwner {
        require(_stakedToken.totalSupply() >= 0);
        require(_rewardToken.totalSupply() >= 0);

        bytes memory bytecode = type(StakingPoolInitializable).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(_stakedToken, _rewardToken, _startBlock));
        address stakingPoolAddress;

        assembly {
            stakingPoolAddress := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        StakingPoolInitializable(stakingPoolAddress).initialize(
            _stakedToken,
            _rewardToken,
            _rewardFrom,
            _rewardPerBlock,
            _startBlock,
            _bonusEndBlock,
            _poolLimitPerUser,
            _admin
        );

        emit NewStakingPoolContract(stakingPoolAddress);
    }
}
