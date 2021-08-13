import { ethers } from 'hardhat'
import { expect } from 'chai'
import { expandTo18Decimals, advanceBlockTo } from './shared/utilities'

describe('StakingPool', function () {
  before(async function () {
    this.signers = await ethers.getSigners()
    this.minter = this.signers[0]
    this.rewardFrom = this.signers[1]
    this.admin = this.signers[2]
    this.alice = this.signers[3]

    this.StakingPoolFactory = await ethers.getContractFactory('StakingPoolFactory')
    this.FAMToken = await ethers.getContractFactory('FAMToken', this.minter)
  })

  beforeEach(async function () {
    this.fam = await this.FAMToken.deploy()
    await this.fam.deployed()

    this.factory = await this.StakingPoolFactory.deploy()
    await this.factory.deployed()
    await this.fam.transfer(this.rewardFrom.address, expandTo18Decimals(1000))
    await this.fam.transfer(this.alice.address, expandTo18Decimals(10))
  })

  it('should set correct state variables', async function () {
    const poolAddress = '0x2D313645652F9FDF4af0CEc9f91e3e852C09c894'
    await expect(this.factory.deployPool(
      this.fam.address,
      this.fam.address,
      this.rewardFrom.address,
      expandTo18Decimals(1),
      0,
      100,
      0,
      this.admin.address,
    ))
      .to.emit(this.factory, 'NewStakingPoolContract')
      .withArgs(poolAddress)

    const pool = await ethers.getContractAt('StakingPoolInitializable', poolAddress, this.alice)
    await this.fam.connect(this.rewardFrom).approve(poolAddress, expandTo18Decimals(1000))
    await this.fam.connect(this.alice).approve(poolAddress, expandTo18Decimals(10))

    await advanceBlockTo(9)
    await pool.deposit(expandTo18Decimals(10))
    expect(await this.fam.balanceOf(poolAddress)).to.equal(expandTo18Decimals(10))
    expect(await this.fam.balanceOf(this.alice.address)).to.equal(expandTo18Decimals(0))
    expect(await this.fam.balanceOf(this.rewardFrom.address)).to.equal(expandTo18Decimals(1000))

    await advanceBlockTo(19)
    await pool.deposit(expandTo18Decimals(0))
    expect(await this.fam.balanceOf(poolAddress)).to.equal(expandTo18Decimals(10))
    expect(await this.fam.balanceOf(this.alice.address)).to.equal(expandTo18Decimals(10))
    expect(await this.fam.balanceOf(this.rewardFrom.address)).to.equal(expandTo18Decimals(990))

    await advanceBlockTo(109)
    await pool.withdraw(expandTo18Decimals(10))
    expect(await this.fam.balanceOf(poolAddress)).to.equal(expandTo18Decimals(0))
    expect(await this.fam.balanceOf(this.alice.address)).to.equal(expandTo18Decimals(100))
    expect(await this.fam.balanceOf(this.rewardFrom.address)).to.equal(expandTo18Decimals(910))
  })
})
