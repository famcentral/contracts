module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, foundation } = await getNamedAccounts()
  const { BigNumber } = ethers

  const expandTo18Decimals = (n) => BigNumber.from(n).mul(BigNumber.from(10).pow(18))

  const famTokenAddress = (await deployments.get("FAMToken")).address
  const foundationStartedTs = Math.round(new Date("Sat Jan 01 2022 15:57:48 GMT+0700") / 1000)
  const foundationUnlockYearly = [
    expandTo18Decimals(1000000),
    expandTo18Decimals(2000000),
    expandTo18Decimals(3000000),
    expandTo18Decimals(4000000),
  ]
  await deploy("ArtistFoundationTokenTimelock", {
    from: deployer,
    contract: "YearlyTokenTimelock",
    args: [famTokenAddress, foundation, foundationStartedTs, foundationUnlockYearly],
    log: true,
  })
}

module.exports.tags = ["ArtistFoundationTokenTimelock"]
module.exports.dependencies = ["FAMToken"]