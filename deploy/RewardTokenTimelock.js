module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, reward } = await getNamedAccounts()

  const tgeTs = Math.round(new Date("Sun Aug 01 2021 00:00:00 GMT+0700") / 1000)
  const famTokenAddress = (await deployments.get("FAMToken")).address
  const famToken = await ethers.getContractAt("FAMToken", famTokenAddress)
  const totalSupply = await famToken.totalSupply()

  const rewardAllocation = totalSupply.mul(16).div(100) // 16% totalSupply
  const rewardAllocationChunk = rewardAllocation.mul(2).div(100) // 2% rewardAllocation
  const rewardReleaseInterval = 60 * 60 * 24 * 30 // monthly
  await deploy("RewardTokenTimelock", {
    from: deployer,
    contract: "TokenTimelock",
    args: [famTokenAddress, reward, rewardAllocation, tgeTs, rewardAllocationChunk, rewardReleaseInterval],
    log: true,
  })
}

module.exports.tags = ["RewardTokenTimelock"]
module.exports.dependencies = ["FAMToken"]