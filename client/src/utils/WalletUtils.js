import Web3 from "web3";
import SimpleWallet from "../contracts/SimpleWallet.json";

const contractCallback = (err, res) => {
  console.log(`Solidity Callback Utils`);
  console.error(err);
  if (res) {
    if (res.toString() !== "true") alert(`Response is  ${res.toString()}`);
  }
  if (err) {
    alert(`Error is ${err.toString()}`);
    // throw err;
  }
};

export const executeContractOps = (
  state,
  operation,
  handleGlobalState,
  sendParams,
  OpCallback = contractCallback,
  transactionCallback,
  receiptCallback,
  errorCallback
) => {
  /***
   * Since a contract emits 4 promit events, we need to handle all 4 promi events
   *
   */
  let deployedContract = state.web3.eth.Contract(
    SimpleWallet.abi,
    state.userDetails.onScreenWallet
  );
  debugger;
  let eventCallback = (error, event) => { alert(event); console.log(event); console.log(error)};
  deployedContract.events.allEvents({fromBlock:0}, eventCallback);
  switch (operation) {
    case "deployWallet":
      state.contract.methods
        .deploySimpleWallet()
        .send(sendParams)
        .on("transactionHash", transactionHash => {
          transactionCallback(handleGlobalState,state,transactionHash, operation);
        })
        //.on('receipt',(receipt) => {receiptCallback(receipt)})
        .on("confirmation", (confirmationNumber, receipt) => {
          if (confirmationNumber == 24) {
            console.log(`transaction Confirmed.`);
          }
        })
        .on("receipt", receipt => {
          receiptCallback(state, handleGlobalState, operation, receipt);
        })
        .on("error", error => {
          errorCallback(error);
        });
      break;
    case "getOwner":
      debugger;
     
      deployedContract.methods
        .getOwner()
        .send(sendParams)
        .on("transactionHash", transactionHash => {
          transactionCallback(handleGlobalState,state,transactionHash, operation);
        })
        //.on('receipt',(receipt) => {receiptCallback(receipt)})
        .on("confirmation", (confirmationNumber, receipt) => {
          if (confirmationNumber == 24) {
            console.log(`${operation} transaction Confirmed.`);
          }
        })
        .on("receipt", receipt => {
          receiptCallback(state, handleGlobalState, operation, receipt);
        })
        .on("error", error => {
          errorCallback(error);
        });
      break;
    case "addFunds" :
      /**
       * @params {address} Address to which data needs to
       */
      debugger
      

      let depositBalance = state.web3.utils.toWei(state.modal.params.amount,'ether');
      state.web3.eth.sendTransaction(sendParams).on("transactionHash", transactionHash => {
        transactionCallback(handleGlobalState,state,transactionHash, operation);
      }).on("confirmation", (confirmationNumber, receipt) => {
        console.log(receipt);
        if (confirmationNumber == 24) {
          console.log(`${operation} transaction Confirmed.`);
        }
      })
      .on("receipt", receipt => {
        receiptCallback(state, handleGlobalState, operation, receipt);
      })
      .on("error", error => {
        errorCallback(error);
      });
      break;
    
  }
};
