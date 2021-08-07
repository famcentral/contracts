module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, private } = await getNamedAccounts()

  const famTokenAddress = (await deployments.get("FAMToken")).address

  await deploy("PrivateTokenTimelock", {
    from: deployer,
    args: [famTokenAddress, private],
    log: true,
  })
}

module.exports.tags = ["PrivateTokenTimelock"]
module.exports.dependencies = ["FAMToken"]