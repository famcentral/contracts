module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, advisor } = await getNamedAccounts()

  const famTokenAddress = (await deployments.get("FAMToken")).address
  const famToken = await ethers.getContractAt("FAMToken", famTokenAddress)
  const totalSupply = await famToken.totalSupply()

  const advisorStartedTs = Math.round(new Date("Wed Sep 01 2021 00:00:00 GMT+0700") / 1000)
  const advisorAllocation = totalSupply.mul(12).div(100) // 12% totalSupply
  const advisorAllocationChunk = advisorAllocation.mul(2).div(100) // 2% advisorAllocation
  const advisorReleaseInterval = 60 * 60 * 24 * 30 // monthly
  await deploy("AdvisorTokenTimelock", {
    from: deployer,
    contract: "TokenTimelock",
    args: [famTokenAddress, advisor, advisorAllocation, advisorStartedTs, advisorAllocationChunk, advisorReleaseInterval],
    log: true,
  })
}

module.exports.tags = ["AdvisorTokenTimelock"]
module.exports.dependencies = ["FAMToken"]