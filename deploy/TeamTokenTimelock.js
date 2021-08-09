module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, team } = await getNamedAccounts()

  const famTokenAddress = (await deployments.get("FAMToken")).address
  const famToken = await ethers.getContractAt("FAMToken", famTokenAddress)
  const totalSupply = await famToken.totalSupply()

  const teamStartedTs = Math.round(new Date("Thu Sep 01 2022 00:00:00 GMT+0700") / 1000)
  const teamAllocation = totalSupply.mul(18).div(100) // 18% totalSupply
  const teamAllocationChunk = teamAllocation.mul(10).div(100) // 10% teamAllocation
  const teamReleaseInterval = 60 * 60 * 24 * 30 * 6 // every 6 months
  await deploy("TeamTokenTimelock", {
    from: deployer,
    contract: "TokenTimelock",
    args: [famTokenAddress, team, teamAllocation, teamStartedTs, teamAllocationChunk, teamReleaseInterval],
    log: true,
  })
}

module.exports.tags = ["TeamTokenTimelock"]
module.exports.dependencies = ["FAMToken"]