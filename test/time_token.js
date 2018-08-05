var TimeToken = artifacts.require("./TimeToken.sol");

var contractTimeToken;
//var owner = "0x8180826dc88a61176496210d3ce70cfe02f7ec74";
var maxTotalSupply = 1e27;
var OneToken = 1e18;
var rate = 950000;
var numberClaimToken = 200;

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

    it('verification define time of day', async ()  => {
        var currentTime = 1540033200; //Sat, 20 Oct 2018 11:00:00 GMT
        var isTimeSelling = await contractTimeToken.validPurchaseTime(currentTime);
        assert.equal(false, isTimeSelling);
        currentTime = 1540037100; //Sat, 20 Oct 2018 12:05:00 GMT
        isTimeSelling = await contractTimeToken.validPurchaseTime(currentTime);
        assert.equal(true, isTimeSelling);
        currentTime = 1540038000; //Sat, 20 Oct 2018 12:20:00 GMT
        isTimeSelling = await contractTimeToken.validPurchaseTime(currentTime);
        assert.equal(false, isTimeSelling);
    });

    it('verification balance contracts', async ()  => {
        var totalSupply = await contractTimeToken.totalSupply.call();
        //console.log(JSON.stringify(totalSupply));
        assert.equal( 1e27, Number(totalSupply));

        var balanceOwner = await contractTimeToken.balanceOf(owner);
        //console.log("balanceOwner = " + balanceOwner);
        assert.equal(Number(totalSupply), balanceOwner);
    });

    it('verification buy tokens', async ()  => {
        var tokenAllocated = await contractTimeToken.tokenAllocated.call();
        assert.equal( 0, Number(tokenAllocated));

        var balanceFor = await contractTimeToken.balanceOf(accounts[4]);
        assert.equal(0, balanceFor);

        await contractTimeToken.buyTokens(accounts[4], {from:accounts[4], value: OneToken});
        tokenAllocated = await contractTimeToken.tokenAllocated.call();
        assert.equal(OneToken*rate, Number(tokenAllocated));

        balanceFor = await contractTimeToken.balanceOf(accounts[4]);
        assert.equal(OneToken*rate, balanceFor);
    });

    it('verification claim tokens with function calcAmount()', async ()  => {
        var amountToken = await contractTimeToken.calcAmount.call(accounts[1]);
        assert.equal(OneToken*numberClaimToken, amountToken);
        amountToken = await contractTimeToken.calcAmount(accounts[1]);
        amountToken = await contractTimeToken.calcAmount.call(accounts[1]);
        assert.equal(OneToken*numberClaimToken*0.95, amountToken);
        amountToken = await contractTimeToken.calcAmount(accounts[1]);
        for(var j = 3; j < 20; j++){
            amountToken = await contractTimeToken.calcAmount(accounts[1]);
        }
        amountToken = await contractTimeToken.calcAmount.call(accounts[1]);
        assert.equal(OneToken*numberClaimToken*0.05, amountToken);
        amountToken = await contractTimeToken.calcAmount(accounts[1]);
        amountToken = await contractTimeToken.calcAmount.call(accounts[1]);
        assert.equal(0, amountToken);
    });

    it('verification claim tokens', async ()  => {
        var amountToken = await contractTimeToken.balanceOf(accounts[2]);
        assert.equal(0, amountToken);
        await contractTimeToken.claim({from:accounts[2], value: 0.0005*OneToken});
        amountToken = await contractTimeToken.balanceOf(accounts[2]);
        assert.equal(OneToken*numberClaimToken, amountToken);

        await contractTimeToken.claim({from:accounts[2], value: 0.0005*OneToken});
        amountToken = await contractTimeToken.balanceOf(accounts[2]);
        assert.equal(OneToken*numberClaimToken + OneToken*numberClaimToken*0.95, amountToken);
    });
});



