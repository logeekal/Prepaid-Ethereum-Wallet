pragma solidity ^0.5.0;


/**
 * 
 * SimpleWalletFactory is a factory for creating wallets that user can use according to
 * there own will.
 * 
 */

contract SimpleWalletFactory{
    
    SimpleWallet wallet;
    address appOwner ;
    uint public balance;
    
    address payable private  walletAddress ;
    
    event GET_WALLET_DETAILS(address payable[] );
    
    event GET_CREATED_WALLET_ADDRESS(address payable);
    
    /**
     * Mapping to easily fetch the list of Wallets a member is attached to
     * @param   {key}   Key is the address of a member
     * @param   {value} Value is the array of wallets a member is part of. 
     * 
     */
    mapping(address=>address payable[] ) public walletDetails;
    
    
    /**
     * 
     *  Mapping to keep the Key values pair to check if the user is 
        member of a particular wallet.
     *
     */
    
    constructor() public{
        appOwner = msg.sender;
    }
    
    function() external payable{
        balance = msg.value;
    }
    
    
    function deploySimpleWallet() public{
        wallet =  new SimpleWallet();
         walletAddress = address(wallet);
        
        // //Add message sender to the list
        // walletDetails[msg.sender].push(walletAddress);
        
        emit GET_CREATED_WALLET_ADDRESS(walletAddress);
    }
    
    function getUserWallets(address _userAddress) public{
        require(msg.sender == _userAddress,'You can only see your wallet Details');
        emit GET_WALLET_DETAILS(walletDetails[_userAddress]);
    }
    
}

contract SimpleWallet{
    
    
    struct WalletStatement{
        address trxAddress;
        uint amount;
        string mode;
        uint block;
    }
    
    bool public withdrawalAllowed;   
    uint public balance;
    address payable public owner;
    
    WalletStatement[] public statement;
    
    constructor() public{
       // owner = msg.sender;
        owner = tx.origin;
        //allowAccessToWallet(owner);
        walletMembers[owner] = true;
    }
    

    modifier onlyOwner{
        require(msg.sender == owner,"You are not authorized for this transaction.");
        _;
    }
    
    modifier onlyAuthorized{
        require(walletMembers[msg.sender] == true, "You are not allowed to withdraw funds. Go Away!");
        _;
    }
    
    mapping(address => bool) walletMembers;
    
    event deposit(address _sender, uint _amount);
    
    event withdrawal(address _sender, address _beneficiary, uint _amount);
    
    event transaction(address _trxAddress, uint _amount, string mode, uint blockNumber);
    
    /**
     * fallback function which always fires if only Transaction is being sent to the Wallet.
     */
    function() external payable{
        balance+=msg.value;
        WalletStatement memory thisStatement = WalletStatement({
            trxAddress : msg.sender,
            amount: msg.value,
            mode:'Deposit',
            block : block.number
        });
        
        statement.push(thisStatement);
        emit deposit(msg.sender, msg.value);
    }
    
    
    /**
     * sendFunds allow authorized user to send funds from one account to the other.
     */
    function sendFunds(uint _amount, address payable _receiver) public onlyAuthorized{
        //Check if the sender is allowed to send amount to anyone
        // require(walletMembers[msg.sender] = true);
        
        //only authorized user will be able to send the amount.
        emit withdrawal(msg.sender, _receiver, _amount);
        
        _receiver.transfer(_amount);
        balance-= _amount;
        
        WalletStatement memory thisStatement = WalletStatement({
            trxAddress : _receiver,
            amount: _amount,
            mode:'Withdrawal',
            block : block.number
        });
        
        statement.push(thisStatement);
    }
    
    
    function allowAccessToWallet(address _member) public onlyOwner{
        walletMembers[_member] = true;
    }
    
    
    function disAllowAccessToWallet(address _member) public onlyOwner{
        walletMembers[_member] = false;
    }
    
    function checkAccess() public{
        withdrawalAllowed =  walletMembers[msg.sender];
    }
    
    function getBalance() public onlyOwner returns(uint){
        return balance;
    }
    
    function isAllowedToSend(address _candidate) public onlyOwner returns(bool) {
        if(_candidate == owner){
            return true;
        }else{
            return false;
        }
    }
    
    function killWallet() public onlyOwner{
        selfdestruct(owner);
    }
    
    function getTransactions() public onlyOwner{
        for(uint counter=0; counter<statement.length; counter++){
            emit transaction(statement[counter].trxAddress, statement[counter].amount,statement[counter].mode, statement[counter].block);
        }
    }
    
}