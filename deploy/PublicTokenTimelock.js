module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, public } = await getNamedAccounts()
  const { BigNumber } = ethers

  const expandTo18Decimals = (n) => {
    return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
  }

  const famTokenAddress = (await deployments.get("FAMToken")).address
  const publicStartedTs = Math.round(new Date("Fri Jan 01 2021 15:57:48 GMT+0700") / 1000)
  const publicUnlockYearly = [
    expandTo18Decimals(3000000),
    expandTo18Decimals(3000000),
    expandTo18Decimals(4500000),
  ]
  await deploy("PublicTokenTimelock", {
    from: deployer,
    contract: "YearlyTokenTimelock",
    args: [famTokenAddress, public, publicStartedTs, publicUnlockYearly],
    log: true,
  })
}

module.exports.tags = ["PublicTokenTimelock"]
module.exports.dependencies = ["FAMToken"]