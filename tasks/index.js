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

		// Others allocation are not fixed
		// Temporary transfer token to seperate wallet
		const {
			team,
			advisor,
			cofounder,
			private,
			public,
			liquidity,
			reward,
			foundation,
			community } = await hre.getNamedAccounts()

		const teamAllocation = totalSupply.mul(18).div(100) // 18% totalSupply
		await token.transfer(team, teamAllocation)
		console.log(`Lock ${teamAllocation} FAM token to ${team}`)

		const advisorAllocation = totalSupply.mul(12).div(100) // 12% totalSupply
		await token.transfer(advisor, advisorAllocation)
		console.log(`Lock ${advisorAllocation} FAM token to ${advisor}`)

		const cofounderAllocation = totalSupply.mul(5).div(1000) // 0.5% totalSupply
		await token.transfer(cofounder, cofounderAllocation)
		console.log(`Lock ${cofounderAllocation} FAM token to ${cofounder}`)

		const privateAllocation = totalSupply.mul(6).div(100) // 6% totalSupply
		await token.transfer(private, privateAllocation)
		console.log(`Lock ${privateAllocation} FAM token to ${private}`)

		const publicAllocation = totalSupply.mul(105).div(1000) // 10.5% totalSupply
		await token.transfer(public, publicAllocation)
		console.log(`Lock ${publicAllocation} FAM token to ${public}`)

		const liquidityAllocation = totalSupply.mul(10).div(100) // 10% totalSupply
		await token.transfer(liquidity, liquidityAllocation)
		console.log(`Lock ${liquidityAllocation} FAM token to ${liquidity}`)

		const rewardAllocation = totalSupply.mul(16).div(100) // 16% totalSupply
		await token.transfer(reward, rewardAllocation)
		console.log(`Lock ${rewardAllocation} FAM token to ${reward}`)
		
		const foundationAllocation = totalSupply.mul(10).div(100) // 10% totalSupply
		await token.transfer(foundation, foundationAllocation)
		console.log(`Lock ${foundationAllocation} FAM token to ${foundation}`)

		const communityAllocation = totalSupply.mul(14).div(100) // 14% totalSupply
		await token.transfer(community, communityAllocation)
		console.log(`Lock ${communityAllocation} FAM token to ${community}`)
	})

task("withdrawSeed", "Withdraw FAM from Seed Timelock contract")
	.setAction(async (_args, hre) => {
		const seedAddress = (await hre.deployments.get("SeedTokenTimelock")).address
		console.log('SeedTokenTimelock Address:', seedAddress)
		const seed = await hre.ethers.getContractAt('TokenTimelock', seedAddress)
		await seed.withdraw()

		const tokenAddress = (await hre.deployments.get("FAMToken")).address
		const token = await hre.ethers.getContractAt('FAMToken', tokenAddress)
		const balance = await token.balanceOf(seedAddress)
		console.log(`SeedTokenTimelock current balance: ${balance}`)
	})
