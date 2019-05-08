//import web3 from 'web3';
const  SimpleWallet = artifacts.require("./SimpleWallet.sol");


contract("SimpleWallet Test", async accounts => {

    let owner = accounts[0];
    let jason = accounts[1];

    /**
     * First Test : It checks if admin is allowed to send or widthraw funds to theWallet.
     */

    it("Should be possible for  admin to deposit and withdraw ether", async ()=>{

        let instance = await SimpleWallet.deployed();
        let isAllowedToSend = await instance.isAllowedToSend.call(owner);
        assert.equal(true, isAllowedToSend,"This Admin was not allowed to deposit and withdraw");
    });

    /**
     * Second Test :  It checks if the non admin is sending and widthrawing transaction..Answer should be false.
     */

    it("Should not be possible for non-admin to deposit and withdraw ether", async ()=>{

        let instance = await SimpleWallet.deployed();
        let isAllowedToSend = await instance.isAllowedToSend.call(jason);
        assert.equal(false, isAllowedToSend,"This non-Owner was  allowed to deposit and withdraw");
    });


    /**
     * 
     * 3- Non Owner should be not be able to call getBalance.
     */

    it("Non Owner call to getBalance should result in error.", async() => {
        
        try{
            let wallet = await SimpleWallet.deployed();
            await wallet.getBalance.call({"from": jason });

        }catch(error){
            console.log(error.message);
            assert.strictEqual(error.message,"Returned error: VM Exception while processing transaction: revert You are not authorized for this transaction.");
        }
  
        
        
    })



    /**
     * 3 - This test check if the balance that has been loaded is reflecting in the Wallet.
     */


     it("Balance transferred to the Wallet  should be reflected as result of  getBalance function" , async ()=>{
        let wallet = await SimpleWallet.deployed();
        let depositBalance =  web3.utils.toWei("10","ether");
        //depositing ether in the wallet.
        console.log(`Depositing Balance ${depositBalance} Wei`)
        wallet.send(depositBalance);
        
        let walletBalance = await wallet.getBalance.call();
        //walletBalance is coming as hexadecimal.
        console.log(walletBalance.toString());
        assert.strictEqual(depositBalance.toString(), walletBalance.toString(), `Balance deposited is not equal to the balance found in WAllet  :  \n Balance Deposited : ${depositBalance} \n Balance  in Wallet : ${walletBalance}`);

     });

});