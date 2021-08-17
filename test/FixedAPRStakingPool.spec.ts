import { ethers } from 'hardhat'
import { expect } from 'chai'
import { expandTo18Decimals, advanceBlockTo } from './shared/utilities'

describe('FixedAPRStakingPool', function () {
  before(async function () {
    this.signers = await ethers.getSigners()
    this.minter = this.signers[0]
    this.rewardFrom = this.signers[1]
    this.admin = this.signers[2]
    this.alice = this.signers[3]

    this.FixedAPRStakingPool = await ethers.getContractFactory('FixedAPRStakingPool')
    this.FAMToken = await ethers.getContractFactory('FAMToken', this.minter)
  })

  beforeEach(async function () {
    this.fam = await this.FAMToken.deploy()
    await this.fam.deployed()

    this.pool = await this.FixedAPRStakingPool.deploy()
    await this.pool.deployed()
    await this.fam.transfer(this.rewardFrom.address, expandTo18Decimals(1000))
    await this.fam.transfer(this.alice.address, expandTo18Decimals(10))
  })

  it('should set correct state variables', async function () {
    const firstBlock = await ethers.provider.getBlockNumber()
    await this.pool.initialize(
      this.fam.address,
      this.fam.address,
      this.rewardFrom.address,
      expandTo18Decimals(1),
      firstBlock,
      firstBlock + 100,
      0,
      this.admin.address,
    )

    await this.fam.connect(this.rewardFrom).approve(this.pool.address, expandTo18Decimals(1000))
    await this.fam.connect(this.alice).approve(this.pool.address, expandTo18Decimals(10))

    await advanceBlockTo(firstBlock + 9)
    await this.pool.connect(this.alice).deposit(expandTo18Decimals(10))
    expect(await this.fam.balanceOf(this.pool.address)).to.equal(expandTo18Decimals(10))
    expect(await this.fam.balanceOf(this.alice.address)).to.equal(expandTo18Decimals(0))
    expect(await this.fam.balanceOf(this.rewardFrom.address)).to.equal(expandTo18Decimals(1000))

    await advanceBlockTo(firstBlock + 19)
    await this.pool.connect(this.alice).deposit(expandTo18Decimals(0))
    expect(await this.fam.balanceOf(this.pool.address)).to.equal(expandTo18Decimals(10))
    expect(await this.fam.balanceOf(this.alice.address)).to.equal(expandTo18Decimals(100))
    expect(await this.fam.balanceOf(this.rewardFrom.address)).to.equal(expandTo18Decimals(900))

    await advanceBlockTo(firstBlock + 109)
    await this.pool.connect(this.alice).withdraw(expandTo18Decimals(10))
    expect(await this.fam.balanceOf(this.pool.address)).to.equal(expandTo18Decimals(0))
    expect(await this.fam.balanceOf(this.alice.address)).to.equal(expandTo18Decimals(910))
    expect(await this.fam.balanceOf(this.rewardFrom.address)).to.equal(expandTo18Decimals(100))
  })
})
