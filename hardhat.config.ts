import "@nomiclabs/hardhat-etherscan";
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';
import "./tasks"

import { HardhatUserConfig } from 'hardhat/config';

const accounts = {
  mnemonic: process.env.MNEMONIC || 'expect symbol file iron clever enjoy raven please stock sentence later seven',
};

const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: { default: 0 },
    seed: {
      default: 1,
      56: '0xF240E120E787261138c3529a793eac1549a1B235'
    },
    team: {
      default: 2,
      56: '0x0C80940A532b0bd5816230fECb7eCD479021C88D'
    },
    advisor: {
      default: 3,
      56: '0x51caD3b9812EcD235657aa03803E459eF5D5F898'
    },
    founding: {
      default: 4,
      56: '0x0B887c18216bcCAf5641680D84278bCE2EEfEf91'
    },
    private: {
      default: 5,
      56: '0xcA5f61f9731202b9D21a65fa783351d1ba1aAC16'
    },
    public: {
      default: 6,
      56: '0x0c1afc94648180006962D9D25d0FD3213Ef552Fc'
    },
    liquidity: {
      default: 7,
      56: '0x49957ae4Fe7066900Cc6b112599AD043b50bF815'
    },
    reward: {
      default: 8,
      56: '0x7dF0312034bA3e991083d6e139ec80b2f5a10dA0'
    },
    foundation: {
      default: 9,
      56: '0x46AA6f127D136cB438AA272bB1f7688377476B34'
    },
    community: {
      default: 10,
      56: '0x16B875998C40D70C2a574b5FF7bDC6CFce819e8F'
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    localhost: {
      accounts,
      live: false,
      saveDeployments: true,
    },
    ganache: {
      chainId: 1337,
      url: 'http://127.0.0.1:7545',
      accounts,
      live: false,
      saveDeployments: true,
    },
    bsc: {
      chainId: 56,
      gasPrice: 7000000000,
      url: 'https://bsc-dataseed.binance.org',
      accounts,
      live: true,
      saveDeployments: true,
    },
    bscTestnet: {
      chainId: 97,
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      accounts,
      live: true,
      saveDeployments: true,
    },
  },
  solidity: {
    compilers: [{
      version: '0.6.12',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        metadata: {
          bytecodeHash: 'none',
        },
      },
    }],
  },
};

export default config;
