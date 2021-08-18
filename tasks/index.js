const { task } = require("hardhat/config")
const { BigNumber } = require('ethers')

function expandTo18Decimals(n) {
	return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

task('accounts', 'Prints the list of accounts', async (_args, hre) => {
	const accounts = await hre.ethers.getSigners();
	for (const account of accounts) {
		console.log(account.address);
	}
});

task("locktoken", "Send FAM to Timelock contract")
	.setAction(async (_args, hre) => {
		const tokenAddress = (await hre.deployments.get("FAMToken")).address
		console.log('FAMToken Address:', tokenAddress)
		const token = await hre.ethers.getContractAt('FAMToken', tokenAddress)
		const totalSupply = await token.totalSupply()

		const seedAddress = (await hre.deployments.get("SeedTokenTimelock")).address
		const seedAllocation = totalSupply.mul(3).div(100) // 3% totalSupply
		await token.transfer(seedAddress, seedAllocation)
		console.log(`Lock ${seedAllocation} FAM token to ${seedAddress}`)

		const publicAddress = (await hre.deployments.get("PublicTokenTimelock")).address
		const publicAllocation = totalSupply.mul(105).div(1000) // 10.5% totalSupply
		await token.transfer(publicAddress, publicAllocation)
		console.log(`Lock ${publicAllocation} FAM token to ${publicAddress}`)

		const privateAddress = (await hre.deployments.get("PrivateTokenTimelock")).address
		const privateAllocation = totalSupply.mul(6).div(100) // 6% totalSupply
		await token.transfer(privateAddress, privateAllocation)
		console.log(`Lock ${privateAllocation} FAM token to ${privateAddress}`)

		const liquidityAddress = (await hre.deployments.get("LiquidityTokenTimelock")).address
		const liquidityAllocation = totalSupply.mul(10).div(100) // 10% totalSupply
		await token.transfer(liquidityAddress, liquidityAllocation)
		console.log(`Lock ${liquidityAllocation} FAM token to ${liquidityAddress}`)

		const communityAddress = (await hre.deployments.get("CommunityTokenTimelock")).address
		const communityAllocation = totalSupply.mul(14).div(100) // 14% totalSupply
		await token.transfer(communityAddress, communityAllocation)
		console.log(`Lock ${communityAllocation} FAM token to ${communityAddress}`)

		const rewardAddress = (await hre.deployments.get("RewardTokenTimelock")).address
		const rewardAllocation = totalSupply.mul(16).div(100) // 16% totalSupply
		await token.transfer(rewardAddress, rewardAllocation)
		console.log(`Lock ${rewardAllocation} FAM token to ${rewardAddress}`)

		const teamAddress = (await hre.deployments.get("TeamTokenTimelock")).address
		const teamAllocation = totalSupply.mul(18).div(100) // 18% totalSupply
		await token.transfer(teamAddress, teamAllocation)
		console.log(`Lock ${teamAllocation} FAM token to ${teamAddress}`)

		const advisorAddress = (await hre.deployments.get("AdvisorTokenTimelock")).address
		const advisorAllocation = totalSupply.mul(12).div(100) // 12% totalSupply
		await token.transfer(advisorAddress, advisorAllocation)
		console.log(`Lock ${advisorAllocation} FAM token to ${advisorAddress}`)

		const foundingAddress = (await hre.deployments.get("FoundingTokenTimelock")).address
		const foundingAllocation = totalSupply.mul(5).div(1000) // 0.5% totalSupply
		await token.transfer(foundingAddress, foundingAllocation)
		console.log(`Lock ${foundingAllocation} FAM token to ${foundingAddress}`)

		const foundationAddress = (await hre.deployments.get("ArtistFoundationTokenTimelock")).address
		const foundationAllocation = totalSupply.mul(10).div(100) // 10% totalSupply
		await token.transfer(foundationAddress, foundationAllocation)
		console.log(`Lock ${foundationAllocation} FAM token to ${foundationAddress}`)
	})

task("deployfarm", "Deploy staking pool")
	.setAction(async (_args, hre) => {
		const factoryAddress = (await hre.deployments.get("StakingPoolFactory")).address
		console.log('StakingPoolFactory Address:', factoryAddress)
		const factory = await hre.ethers.getContractAt('StakingPoolFactory', factoryAddress)

		await factory.deployPool(
			'0x9804fC036a283C687f2c034bf5220070fD885A54', // FAM-BNB LP token
			'0x4556A6f454f15C4cD57167a62bdA65A6be325D1F', // FAM token
			'0x54f7EE50bafd09845B1756e9C3B47623ec4620a4', // FAM-Reward
			expandTo18Decimals(1157).div(10000), // 100_000 FAM
			10048469,
			10048469 + 864000, // 30 days
			0,
			'0x54f7EE50bafd09845B1756e9C3B47623ec4620a4', // FAM-Reward
		)
	})

task("initpool", "Init fixed APR staking pool")
	.setAction(async (_args, hre) => {
		const poolAddress = (await hre.deployments.get("FixedAPRStakingPool")).address
		console.log('FixedAPRStakingPool Address:', poolAddress)
		const pool = await hre.ethers.getContractAt('FixedAPRStakingPool', poolAddress)

		await pool.initialize(
			'0x4556A6f454f15C4cD57167a62bdA65A6be325D1F', // FAM token
			'0x4556A6f454f15C4cD57167a62bdA65A6be325D1F', // FAM token
			'0xB1c40902af130b8Ef4978579176c5b6fC62c0Ef0', // FAM-Reward2
			expandTo18Decimals(40).div(100).div(10512000), // APR 40%
			10133374,
			10133374 + 864000 * 3, // 90 days
			0,
			'0xB1c40902af130b8Ef4978579176c5b6fC62c0Ef0', // FAM-Reward2
		  )
	})
