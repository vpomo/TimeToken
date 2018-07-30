var TimeToken = artifacts.require("./TimeToken.sol");
var TokenB = artifacts.require("./TokenB.sol");

var contractTimeToken;
var contractB;
//var owner = "0x8180826dc88a61176496210d3ce70cfe02f7ec74";
var maxTotalSupply = 1e27;
var OneToken = 121;

contract('TimeToken', (accounts) => {
    var owner = accounts[0];

    it('should deployed contract Time Token', async ()  => {
        assert.equal(undefined, contractTimeToken);
        contractTimeToken = await TimeToken.deployed();
        assert.notEqual(undefined, contractTimeToken);
    });

    it('get address contract Time Token', async ()  => {
        assert.notEqual(undefined, contractTimeToken.address);
    });

    it('verification balance contracts', async ()  => {
        var totalSupplyA = await contractTimeToken.totalSupply.call();
        //console.log(JSON.stringify(totalSupplyTest));
        assert.equal( 1e12, Number(totalSupplyA));

        var balanceOwnerA = await contractTimeToken.balanceOf(owner);
        //console.log("balanceOwnerA = " + balanceOwnerA);
        assert.equal(Number(totalSupplyA), balanceOwnerA);

        var totalSupplyB = await contractTimeToken.totalSupply.call();
        assert.equal( 0, Number(totalSupplyB));

        var balanceOwnerB = await contractTimeToken.balanceOf(owner);
        assert.equal(Number(totalSupplyB), balanceOwnerB);

    });

});



