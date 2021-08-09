module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, community } = await getNamedAccounts()

  const tgeTs = Math.round(new Date("Sun Aug 01 2021 00:00:00 GMT+0700") / 1000)
  const famTokenAddress = (await deployments.get("FAMToken")).address
  const famToken = await ethers.getContractAt("FAMToken", famTokenAddress)
  const totalSupply = await famToken.totalSupply()

  const communityAllocation = totalSupply.mul(14).div(100) // 14% totalSupply
  const communityAllocationChunk = communityAllocation.mul(2).div(100) // 2% communityAllocation
  const communityReleaseInterval = 60 * 60 * 24 * 30 // monthly
  await deploy("CommunityTokenTimelock", {
    from: deployer,
    contract: "TokenTimelock",
    args: [famTokenAddress, community, communityAllocation, tgeTs, communityAllocationChunk, communityReleaseInterval],
    log: true,
  })
}

module.exports.tags = ["CommunityTokenTimelock"]
module.exports.dependencies = ["FAMToken"]