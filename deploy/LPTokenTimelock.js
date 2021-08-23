module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, liquidity } = await getNamedAccounts()
  const { BigNumber } = ethers

  const expandTo18Decimals = (n) => BigNumber.from(n).mul(BigNumber.from(10).pow(18))

  const lpTokenAddress = '0x9804fC036a283C687f2c034bf5220070fD885A54'
  const lpStartedTs = Math.round(new Date("Web Feb 02 2022 02:02:02 GMT+0700") / 1000)
  const totalAmount = expandTo18Decimals(10000) // 10_000 LP token
  const chunkAmount = totalAmount // 100%
  const chunkInterval = 60 * 60 * 24 * 30 // monthly
  
  await deploy("LPTokenTimelock", {
    from: deployer,
    contract: "TokenTimelock",
    args: [lpTokenAddress, liquidity, totalAmount, lpStartedTs, chunkAmount, chunkInterval],
    log: true,
  })
}

module.exports.tags = ["LPTokenTimelock"]
