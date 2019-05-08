var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SimpleWallet = artifacts.require('../contracts/SimpleWallet.sol');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(SimpleWallet);
};
