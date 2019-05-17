//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
//var SimpleWallet = artifacts.require('SimpleWallet');
var SimpleWalletFactory = artifacts.require('SimpleWalletFactory');
var SimpleWallet = artifacts.require('SimpleWallet');

module.exports = function(deployer) {
  deployer.deploy(SimpleWalletFactory);
  deployer.deploy(SimpleWallet);
  
};
