import React from "react";
import "./Dashboard.css";
import { UserProfile } from "./UserProfile";
import { Operations } from "./Operations";
import _ from "lodash";
import { WalletDetails } from "./WalletDetails";

export class Dashboard extends React.Component {
  
  constructor(props) {
    super(props);
    this.operation = "";
  }

  componentDidMount(){
    //On coming to Dashboard call the wallet list.
    
    const contractCallback = (err, res) =>{
        console.log(`Solidity Callback ${this.operation}`);
        console.error(err);
        if(res){if(res.toString() !== 'true')alert(`Response is  ${res.toString()}`)};
        if(err){
            alert(`Error is ${err.toString()}`);
            // throw err;
        }
    } ;
    this.operation = "getUserWallet";

    this.props.state.contract.methods.getUserWallets(this.props.state.accounts[0]).send({from: this.props.state.accounts[0]},contractCallback);
  }

  render() {
    return [
      <WalletDetails state={this.props.state} handleGlobalState={this.props.handleGlobalState} />
      ,
      <div className="users">
        {_.keys(this.props.state.members).map(addressVal => {
          return (
            <div className="profileArea card">
              <UserProfile
                address={addressVal}
                state={this.props.state}
                handleGlobalState={this.props.handleGlobalState}
              />
              <Operations
                state={this.props.state}
                handleGlobalState={this.props.handleGlobalState}
                address={addressVal}
              />
            </div>
          );
        })}
      </div>
    ];
  }
}
