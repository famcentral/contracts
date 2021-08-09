module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, founding } = await getNamedAccounts()

  const famTokenAddress = (await deployments.get("FAMToken")).address
  const famToken = await ethers.getContractAt("FAMToken", famTokenAddress)
  const totalSupply = await famToken.totalSupply()

  const foundingStartedTs = Math.round(new Date("Thu Sep 01 2022 00:00:00 GMT+0700") / 1000)
  const foundingAllocation = totalSupply.mul(5).div(1000) // 0.5% totalSupply
  const foundingAllocationChunk = foundingAllocation // 100% foundingAllocation
  const foundingReleaseInterval = 60 * 60 * 24 * 30
  await deploy("FoundingTokenTimelock", {
    from: deployer,
    contract: "TokenTimelock",
    args: [famTokenAddress, founding, foundingAllocation, foundingStartedTs, foundingAllocationChunk, foundingReleaseInterval],
    log: true,
  })
}

module.exports.tags = ["FoundingTokenTimelock"]
module.exports.dependencies = ["FAMToken"]