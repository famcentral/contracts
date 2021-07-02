module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy("FAMToken", {
    from: deployer,
    log: true,
  })
}

module.exports.tags = ["FAMToken"]