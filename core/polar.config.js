require('dotenv').config();

const accounts = [
  {
    name: 'account_0',
    address: 'secret1l0g5czqw7vjvd20ezlk4x7ndgyn0rx5aumr8gk',
    mnemonic: 'snack cable erode art lift better october drill hospital clown erase address'
  },
  {
    name: 'account_1',
    address: 'secret1ddfphwwzqtkp8uhcsc53xdu24y9gks2kug45zv',
    mnemonic: 'sorry object nation also century glove small tired parrot avocado pulp purchase'
  }
];
const accounts_prod = [{
  name: 'account_0',
  address: process.env['MAINNET_ADDRESS'],
  mnemonic: process.env['MAINNET_MNEMONIC'],
}]

const networks = {
  devnet: {
    endpoint: process.env['DEVNET_ADDR'],
    chainId: 'secretdev-1',
    accounts: accounts,
  },
  // Pulsar-2
  testnet: {
    endpoint: 'https://pulsar-2.api.trivium.network:1317/',
    chainId: 'pulsar-2',
    accounts: accounts_prod,
  },
  mainnet: {
    endpoint: 'https://secret-4.api.trivium.network:1317/',
    chainId: 'secret-4',
    accounts: accounts_prod,
  }
};

module.exports = {
  networks: {
    default: networks.devnet,
    testnet: networks.testnet,
    mainnet: networks.mainnet
  },
  mocha: {
    timeout: 60000
  },
  rust: {
    version: "1.55.0",
  }
};
