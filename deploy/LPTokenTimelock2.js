module.exports = async function ({ getNamedAccounts, deployments, ethers }) {
  const { deploy } = deployments

  const { deployer, liquidity } = await getNamedAccounts()
  const { BigNumber } = ethers

  const expandTo18Decimals = (n) => BigNumber.from(n).mul(BigNumber.from(10).pow(18))

  const lpTokenAddress = '0x03db7a7eb9bb6a7070bcc06d09a610fb94b5e231' // FAM-BUSD
  const lpStartedTs = Math.round(new Date("Web Apr 09 2022 02:02:02 GMT+0700") / 1000)
  const totalAmount = expandTo18Decimals(72792) // 72_792 LP token
  const chunkAmount = totalAmount // 100%
  const chunkInterval = 60 * 60 * 24 * 30 // monthly
  
  await deploy("LPTokenTimelock2", {
    from: deployer,
    contract: "TokenTimelock",
    args: [lpTokenAddress, liquidity, totalAmount, lpStartedTs, chunkAmount, chunkInterval],
    log: true,
  })
}

module.exports.tags = ["LPTokenTimelock2"]
