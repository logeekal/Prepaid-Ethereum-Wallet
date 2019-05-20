import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import SimpleWallet from "./contracts/SimpleWallet.json";
import getWeb3 from "./utils/getWeb3";
import _ from "lodash";

import "./App.css";
import { UserProfile } from "./UserProfile.js";
//import { store } from "./store/index.js";
import { updateProperty } from "./actions/index.js";
import { Operations } from "./Operations.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Home } from "./Home";
import { Dashboard } from "./Dashboard";
import SimpleWalletFactory from "./contracts/SimpleWalletFactory.json";
import {
  GET_WALLET_DETAILS_WALLET_FACTORY,
  GET_CREATED_WALLET_ADDRESS_WALLET_FACTORY
} from "./utils/constants.js";

export class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    currentBalance: "0",
    members: null,
    modal: {},
    contractFacts: {},
    userDetails: {
      "loggedIn": false,
      "onScreenWallet": "",
      "pubKey": "",
      "wallets": {
      },
      "transactions" :{

      }
    },
    requestState: {
      "status": "",
      "name": ""
    },
    tempUserDetails :{
      "loggedIn": false,
      "onScreenWallet": "",
      "pubKey": "",
      "wallets": {
      },
      "transactions" :{
        "hash" : "",
        "from" : "",
        "status" : "",
        "operation" : "",
        "initiatedOn" : ""
      }
    }
  };
  // state = store.getState();

  constructor(props) {
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
      const deployedNetwork = SimpleWalletFactory.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleWalletFactory.abi,
        deployedNetwork && deployedNetwork.address
      );
      //adding new member :
      let owner = accounts[0].toString();
      let member = {};

      member[owner] = {};
      member[owner].name = "Owner";
      member[owner].address = accounts[0];
      member[owner].profilepic = "./img/profile.png";
      member[owner].balance = web3.eth.utils.fromWei(
        await web3.eth.getBalance(owner),
        "ether"
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract: instance,
        currentBalance: "0",
        members: member,
      });

 
      let walletAddress = await this.state.contract.address;
      console.log(`got the wallet address :  ${walletAddress}`);
      let walletBalance = this.state.web3.eth.utils.fromWei(
        await this.state.web3.eth.getBalance(walletAddress),
        "ether"
      );
      console.log(`got the wallet balance :  ${walletBalance}`);
      let contractFactsValue = {
        balance: walletBalance,
        address: walletAddress
      };
      await this.setState({ contractFacts: contractFactsValue, userDetails :{
        ...this.state.userDetails,
        pubKey : this.state.accounts[0]

      } });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  async getContractBalance() {
    let walletAddress = await this.state.contract.address;
    console.log(`got the wallet address :  ${walletAddress}`);
    let walletBalance = this.state.web3.eth.utils.fromWei(
      await this.state.web3.eth.getBalance(walletAddress),
      "ether"
    );
    console.log(`got the wallet balance :  ${walletBalance}`);
    this.setState({
      contractFacts: { balance: walletBalance, address: walletAddress }
    });
  }

  getBalance(state, e) {
    console.log(state);
    console.log(e.target.value);

    state.web3.eth.getBalance(e.target.value).then(balance => {
      console.log(`Balance is ${balance}`);
      //store.dispatch(updateProperty("currentBalance" , ));
      this.setState({
        currentBalance: state.web3.utils.fromWei(balance, "ether")
      });
    });
  }

  getState() {
    return this.state;
  }

  handleGlobalState(prop, value) {
    this.setState({ [prop]: value }, () => {
      console.log("Now updating global State : ");
      console.log(this.state);
    });
  }



  render() {
    console.log("Re-rendering");
    console.log(this.state);
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Router>
          <Route exact path="/" render={props => <Home />} />
          <Route
            exact
            path="/dash"
            render={props => (
              <Dashboard
                state={this.state}
                handleGlobalState={this.handleGlobalState}
              />
            )}
          />
        </Router>
      </div>
    );
  }
}

export default App;
