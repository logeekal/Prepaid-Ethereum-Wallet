import "./WalletDetails.css";
import React from "react";
import _ from "lodash";
import { executeContractOps } from "./utils/WalletUtils";
import { handleEvents } from "./utils/eventHandler";
import App from "./App";
import Web3 from "web3";

export const updateTransactions = (handleGlobalState,state,newTransObj) => {
  let currentTransactions = {};
  let transObjArray = [];

  if (_.keys(state.transactions).length !== 0) {
    transObjArray = _.values(state.transactions).sort((a, b) => {
      return a.initiatedOn - b.initiatedOn;
    });

    transObjArray.map(transObj => {
      currentTransactions[transObj.hash] = transObj;
    });
  }
  currentTransactions[newTransObj.hash] = newTransObj;

  handleGlobalState("transactions", currentTransactions);
};

export const transactionCallback = (handleGlobalState,state,transactionHash, operation) => {
  console.log(`in transactionCallback`);
  console.log(
    `Transaction hash for operation ${operation} is ${transactionHash}`
  );
  let user  =  state.userDetails.pubKey;
  updateTransactions(handleGlobalState,state,{
    hash: transactionHash,
    from: user,
    status: "PENDING",
    operation: operation,
    initiatedOn: new Date()
  });
};

export const receiptCallback = (state, handleGlobalState, operation, receipt) => {
  // console.log(`in receiptCallback : ${this.props.state}`);
  console.log(receipt);

  //update transactions :
  updateTransactions(handleGlobalState,state,{
    hash: receipt.transactionHash,
    from: state.userDetails.pubKey,
    status: "COMPLETE",
    operation: operation,
    initiatedOn: new Date()
  });

  //Now expecting events.
  if ("events" in receipt) {
    handleEvents(state, handleGlobalState, receipt.events);
  } else {
      console.log(`No Events Raised.`);
    if (operation === "getOwner") {
      //update the wallet status to be false
      handleGlobalState("userDetails", {
        ...state.userDetails,
        wallets: {
          ...state.userDetails.wallets,
          [state.userDetails.onScreenWallet]: {
            ...state.userDetails.wallets[state.userDetails.onScreenWallet],
            status: false
          }
        }
      });
    }
  }
  // if(receipt.events)
};

export const errorCallback = error => {
  //alert(`I am in ${this.toString()}`);
  console.log("in errorCallback");
//   console.log(`Error Happened ${JSON.stringify(error)}`);
  console.log(error);
};

export class WalletDetails extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount(){
    this.getOnScreenWalletBalance.bind(this);
  }


  async handleCreateWallet(state, handleGlobalState) {
    //DeployWallet and get the address
    executeContractOps(
      this.props.state,
      "deployWallet",
      this.props.handleGlobalState,
      { from: state.userDetails.pubKey, gas: "2000000", gasPrice: "1" },
      null,
      transactionCallback,
      receiptCallback,
      errorCallback
    );
    //Get the owner address of deployed wallet.
  }

  handleOnScreenWallet(e){
      debugger
     this.props.handleGlobalState("userDetails",{
         ...this.props.state.userDetails,
         "onScreenWallet" : e.target.value
     }) 

    this.getOnScreenWalletBalance.bind(this);
  }


  async getOnScreenWalletBalance() {
    
    let balance  = await this.props.state.web3.eth.getBalance(this.props.state.userDetails.onScreenWallet);

    this.handleGlobalState("userDetails", {
        ...this.props.state.userDetails,
        "wallets" :{
            ...this.props.state.userDetails.wallets,
            [this.props.state.userDetails.onScreenWallet] :{
                ...this.props.state.userDetails.wallets.balance = balance
            }
        }
    })
  }

  render() {
    /**
     * First check how many wallets are already there.
     * If none -- > show a button to create one.
     * Else --> set any one of the wallet as active wallet.
     *
     */
    let currWallets = false;
    if (this.props.state.userDetails.onScreenWallet !== "") {
      {
        currWallets = true;
      }
    }
    // if(parseInt(_.keys(this.props.state.userDetails.wallets).length) > 0){
    //     createButton = false;
    //     this.props.handleGlobalState("userDetails", {
    //         ...this.props.state.userDetails,
    //         "onScreenWallet" : _.keys(this.props.state.userDetails.wallets)[0]
    //     } );
    // }

    return (
      <div className="wallet-header">
        {currWallets &&
            [
           <select class="wallet_List" onChange={this.handleOnScreenWallet.bind(this)}>
            {_.keys(this.props.state.userDetails.wallets).map(wallet => {
                
                if(this.props.state.userDetails.wallets[wallet].status){
                    return <option value={wallet} 
                    key={wallet}
                    selected = {wallet === this.props.state.userDetails.onScreenWallet}
                    >{wallet}</option>

                }
                
                
            })
            
            } 
            </select>,
            <p class="wallet__balance">{this.props.state.userDetails.wallets[this.props.state.userDetails.onScreenWallet].balance}</p>   
        ]
        }
        
          <button
            className="btn deployButton"
            onClick={this.handleCreateWallet.bind(
              this,
              this.props.state,
              this.props.handleGlobalState
            )}
          >
            Create Wallet
          </button>

     </div>

    );
  }
}
