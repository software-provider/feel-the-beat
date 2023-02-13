// var Users = artifacts.require("./Users.sol");

// module.exports = function(deployer) {
//   deployer.deploy(Users);
// };
var FeelTheBeat = artifacts.require("./FeelTheBeat.sol");
var BeatBattle = artifacts.require("./BeatBattle.sol");

module.exports = function(deployer) {
  deployer.deploy(FeelTheBeat);
  deployer.deploy(BeatBattle);
};
