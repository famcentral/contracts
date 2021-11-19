module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()
  await deploy("FixedAPRStakingPool2", {
    from: deployer,
    contract: "FixedAPRStakingPool",
    args: [],
    log: true,
  })
}

module.exports.tags = ["FixedAPRStakingPool2"]