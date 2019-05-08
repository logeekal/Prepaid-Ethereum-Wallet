import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import SimpleWallet from './contracts/SimpleWallet.json';
import getWeb3 from "./utils/getWeb3";
import _ from 'lodash';

import "./App.css";
import { UserProfile } from "./UserProfile.js";
//import { store } from "./store/index.js";
import { updateProperty } from "./actions/index.js";
import { Operations } from "./Operations.js";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null , currentBalance :"0", "members": null, "modal":{}, contractFacts :{}};
 // state = store.getState();

  constructor(props){
    super(props);
    this.handleGlobalState = this.handleGlobalState.bind(this);

  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleWallet.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleWallet.abi,
        deployedNetwork && deployedNetwork.address,
      );
      //adding new member :
      let owner = accounts[0].toString();
      let member = {};

      member[owner] = {};
      member[owner].name="Owner";
      member[owner].address= accounts[0];
      member[owner].profilepic ="./img/profile.png";
      member[owner].balance  =  web3.eth.utils.fromWei(await web3.eth.getBalance(owner),"ether");

 
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
    this.setState({ web3, accounts, contract: instance , currentBalance : "0", "members" : member});
    

    let walletAddress =  await this.state.contract.address;
    console.log(`got the wallet address :  ${walletAddress}`)
    let walletBalance = this.state.web3.eth.utils.fromWei(await  this.state.web3.eth.getBalance(walletAddress),"ether");
    console.log(`got the wallet balance :  ${walletBalance}`);
    let contractFactsValue =  {"balance" :  walletBalance ,"address" : walletAddress};
    await this.setState({contractFacts :contractFactsValue});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  async getContractBalance() {
    let walletAddress =  await this.state.contract.address;
    console.log(`got the wallet address :  ${walletAddress}`)
    let walletBalance = this.state.web3.eth.utils.fromWei(await  this.state.web3.eth.getBalance(walletAddress),"ether");
    console.log(`got the wallet balance :  ${walletBalance}`);
    this.setState({contractFacts : {"balance" :  walletBalance ,"address" : walletAddress}});
  }

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(10).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  // getAccountList(){
  //   //const web3 = await getWeb3();
  //   //const accounts = await web3.eth.getAccounts()
  //   let accounts = this.getState().accounts;

  //   accounts.map(acct=>{
  //      <option value={acct}>{acct}</option>
  //   })

// }

  getBalance(state,e){
    console.log(state);
    console.log(e.target.value);

   
  state.web3.eth.getBalance(e.target.value)
    .then((balance)=>{
      console.log(`Balance is ${balance}`)
      //store.dispatch(updateProperty("currentBalance" , ));
      this.setState({"currentBalance" : state.web3.utils.fromWei(balance,"ether")});
    });
  }

  getState(){
    return this.state;
  }

  handleGlobalState(prop, value){
    this.setState({[prop]:value}, () => { console.log("Now updating global State : "); console.log(this.state)});
  }

  // shouldComponentUpdate(){

  // }


  render() {
    console.log("Re-rendering");
    console.log(this.state);
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (

      <div className="App">
        {/* <h1>Good to Go!</h1>
        <select onChange={this.getBalance.bind(this, this.state)}>
        {this.state.accounts.map((acct) =>{
       return <option value={acct} >{acct}</option>
    })}

        </select>
        <h1 ref="balance">{this.state.currentBalance}</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>*/}
        <header className="header card">
        <h1>Welcome to your Prepaid Wallet</h1>
        <hr/> 
        <div className="wallet_details">
        <div className="address">
        <p> 

         {this.state.contractFacts.address}
        </p>
        </div>
        <div className="balance">{this.state.contractFacts.balance} ETH</div>
        </div>
        </header>
        <div className="users">

        {_.keys(this.state.members).map((addressVal)=>{
          return (<div className="profileArea card">
            <UserProfile address={addressVal} state={this.state} handleGlobalState= {this.handleGlobalState}/>
            <Operations state={this.state} handleGlobalState= {this.handleGlobalState} address={addressVal}/>
          </div>)

        })}
        </div>


      </div>
    );
  }
}

export default App;
