module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      // gas: 500000,
      gas: 4698712,
      gasPrice: 25000000000
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: { enabled: true, runs: 200 } 
    }
  }
};
