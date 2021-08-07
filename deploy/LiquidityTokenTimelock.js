module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, liquidity } = await getNamedAccounts()
  const { BigNumber } = ethers

  const expandTo18Decimals = (n) => BigNumber.from(n).mul(BigNumber.from(10).pow(18))

  const famTokenAddress = (await deployments.get("FAMToken")).address
  const liquidityStartedTs = Math.round(new Date("Fri Jan 01 2021 15:57:48 GMT+0700") / 1000)
  const liquidityUnlockYearly = [
    expandTo18Decimals(1000000),
    expandTo18Decimals(2000000),
    expandTo18Decimals(3000000),
    expandTo18Decimals(4000000),
  ]
  await deploy("LiquidityTokenTimelock", {
    from: deployer,
    contract: "YearlyTokenTimelock",
    args: [famTokenAddress, liquidity, liquidityStartedTs, liquidityUnlockYearly],
    log: true,
  })
}

module.exports.tags = ["LiquidityTokenTimelock"]
module.exports.dependencies = ["FAMToken"]