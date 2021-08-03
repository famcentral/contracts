module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, seed } = await getNamedAccounts()

  const tgeTs = Math.round(new Date("Fri Jul 05 2021 14:00:00 GMT+0700") / 1000)
  const famTokenAddress = (await deployments.get("FAMToken")).address
  const famToken = await ethers.getContractAt("FAMToken", famTokenAddress)
  const totalSupply = await famToken.totalSupply()

  const seedAllocation = totalSupply.mul(3).div(100) // 3% totalSupply
  const seedAllocationChunk = seedAllocation.mul(10).div(100) // 10% seedAllocation
  const seedReleaseInterval = 60 * 60 * 24 * 30 // monthly
  await deploy("SeedTokenTimelock", {
    from: deployer,
    contract: "TokenTimelock",
    args: [famTokenAddress, seed, seedAllocation, tgeTs, seedAllocationChunk, seedReleaseInterval],
    log: true,
  })
}

module.exports.tags = ["SeedTokenTimelock"]
module.exports.dependencies = ["FAMToken"]