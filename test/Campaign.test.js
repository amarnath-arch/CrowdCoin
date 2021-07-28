const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const compiledCampaign = require('../ethereum/build/Campaign.json');
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');

const web3 = new Web3(ganache.provider());

let accounts;
let campaignFactory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    campaignFactory = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface)).
        deploy({ data: compiledCampaignFactory.bytecode }).
        send({ from: accounts[0], gas: '1000000' });


    await campaignFactory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await campaignFactory.methods.getDeployedContracts().call();

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);


});


describe('Campaign', () => {

    it('Deployment of Factory and Campaign', () => {
        assert.ok(campaignFactory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Caller is the manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('Contribute and marked as Approver', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });

        const marked = await campaign.methods.approvers(accounts[1]).call();

        assert(marked);
    });

    it('Contibutes minimum amount of money', () => {
        try {
            campaign.contribute().send({
                from: accounts[1],
                value: '80'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Manager makes payment request', async () => {
        await campaign.methods.createRequest('BuyBatteries', '100', accounts[1]).send({ from: accounts[0], gas: '1000000' });

        const result = await campaign.methods.requests(0).call();

        assert.equal('BuyBatteries', result.description);

    });

    it('end to end test', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest('Buysomething', web3.utils.toWei('5', 'ether'), accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let initBalance = await web3.eth.getBalance(accounts[1]);
        initBalance = await web3.utils.fromWei(initBalance, 'ether');
        initBalance = parseFloat(initBalance);

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let FinalBalance = await web3.eth.getBalance(accounts[1]);
        FinalBalance = await web3.utils.fromWei(FinalBalance, 'ether');
        FinalBalance = parseFloat(FinalBalance);
        console.log(FinalBalance);
        console.log(initBalance);

        assert(FinalBalance > initBalance);





    });
});
