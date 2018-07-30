const TokenA = artifacts.require('./TimeToken.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner = "0x8180826dc88a61176496210d3ce70cfe02f7ec74";
    deployer.deploy(TokenA, owner);
};
