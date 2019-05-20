import { App } from "../App";
/***
 * START
 * Setting up Event Subscribption for the contracts.
 */

 import _ from 'lodash';
import {
    GET_WALLET_DETAILS_WALLET_FACTORY,
    GET_CREATED_WALLET_ADDRESS_WALLET_FACTORY,
    GET_OWNER_WALLET,
    DEPOSIT_WALLET
} from './constants';
import { executeContractOps } from "./WalletUtils";

export async function  handleEvents(state, handleGlobalState, events) {

  _.keys(events).map(eventName => {
    switch (eventName) {
      case GET_WALLET_DETAILS_WALLET_FACTORY:
        let walletList = events[GET_WALLET_DETAILS_WALLET_FACTORY].returnedValues.wallets;
        alert(`Got Event ${GET_WALLET_DETAILS_WALLET_FACTORY} `);
        if (walletList.length === 0) {
          alert(`You don't have any Wallet yet.`);
        } else {
          //Now updating the list of Wallets
          let wallets = state.userDetails.wallets;
          walletList.map(wallet => {
            if (!(wallet in wallets)) {
              wallets[wallet] = {};
              wallets[wallet].pubKey = wallet;
              wallets[wallet].status = true;
              wallets[wallet].balance = 0
            }
          });
          //Now wallet  needs to be updated with balance and status.
          //Now getting the status of wallet.
          // let receiptCallback = (receipt) => {
          //   this.handleGlobalState("userDetails")
          // }
          handleGlobalState("userDetails", {
            ...state.userDetails,
            wallets: wallets
          });

        }
        break;
      case GET_CREATED_WALLET_ADDRESS_WALLET_FACTORY:
        console.log(
          `Fired Event ${GET_CREATED_WALLET_ADDRESS_WALLET_FACTORY} ${JSON.stringify(
            events
          )}`
        );
        let wallets = state.userDetails.wallets;
        let walletAddr = events[GET_CREATED_WALLET_ADDRESS_WALLET_FACTORY].returnValues["0"];
        if (!(walletAddr in wallets)) {
          wallets[walletAddr] = {};
          wallets[walletAddr].pubKey = walletAddr;
          wallets[walletAddr].status = true
          wallets[walletAddr].balance = "0"
        }
        let finaluserDetails = {
          ...state.userDetails,
          onScreenWallet: walletAddr,
          wallets: wallets
        };
        handleGlobalState("userDetails",finaluserDetails );

        
        
        break;
      case GET_OWNER_WALLET:
        debugger
        console.log(`Fired Event Get Owner Wallet`);
        let owner =  events[GET_OWNER_WALLET].returnValues["_owner"];
        handleGlobalState("userDetails",{
          ...state.userDetails,
          "wallets" : {
              ...state.userDetails.wallets,
              [state.userDetails.onScreenWallet] : {
                  ...state.userDetails.wallets[state.userDetails.onScreenWallet],
                  "owner" :  owner
              }
          }
        });
        break;
      case DEPOSIT_WALLET:
        
        console.log(`Fired Deposit Event`);
        let sender = events[DEPOSIT_WALLET].returnValues["_sender"];
        let value = events[DEPOSIT_WALLET].returnValues["_amount"];
        let balance = events[DEPOSIT_WALLET].returnValues["_newBalance"];

        //update the balance of wallet
        wallets = state.userDetails.wallets;
        wallets[events.to].balance = balance;
        
        handleGlobalState("userDetails",{
          ...state.userDetails,
          "wallets" : state.web3.utils.fromWei(balance,'ether')
        });

        //update the balance of sender 
        if(sender === state.userDetails.pubKey){
          state.web3.eth.getBalance(sender).then((returnedBal)=>{
            balance =  returnedBal;
          });
        }
        wallets = state.userDetails.wallets;
        wallets[events.to].balance = balance;
        
        handleGlobalState("userDetails",{
          ...state.userDetails,
          "wallets" : state.web3.utils.fromWei(balance,'ether')
        });
        
    }
  });
}

// const eventCallback = (error, event, state) => {
//         if (error) {
//           alert(`Error Occured : ${error.toString}`);
//         } else {
//           //Handle Events accordingly
//           let eventName = event.event;
//           alert(`Fired Event ${eventName}`);
//           console.log(event);

//         }
//       };

// //Subsctibe to Events
// this.state.contract.events[GET_WALLET_DETAILS_WALLET_FACTORY](
//   {},
//   eventCallback
// );

// this.state.contract.events[GET_CREATED_WALLET_ADDRESS_WALLET_FACTORY](
//   {},
//   eventCallback
// );
