import './WalletDetails.css'
import React from 'react';
import _ from 'lodash';

export class WalletDetails extends React.Component{

    constructor(props){
        super(props);
        this.props = props;
    }

    async handleCreateWallet(state, handleGlobalState){

        const contractCallback = (err, res) =>{
            console.log(`Solidity Callback XYZ`);
            console.error(err);
            if(res){if(res.toString() !== 'true')alert(`Response is  ${res.toString()}`)};
            if(err){
                alert(`Error is ${err.toString()}`);
               // throw err;
            }
        }


        console.log(`this is ${state.userDetails.pubKey}`);
        await handleGlobalState({requestState : {"status" : "loading" , name : "Create Wallet"}});

        // state.web3.eth.sendTransaction({
        //     from:state.userDetails.pubKey,
        //     to: state.contractFacts.address, 
        //     value:'2000000000000000000',
        //     gas:"900000",
        //     gasPrice : "1" });     

        state.contract.methods.deploySimpleWallet().send({from:state.userDetails.pubKey,gas:"2000000",   gasPrice : "1"  },contractCallback);
    }

    render(){
        return (
        <div className="wallet-header">
            {
                parseInt(_.keys(this.props.state.wallets).length) == 0 ?
                    <button className="btn deployButton" onClick={this.handleCreateWallet.bind(this, this.props.state, this.props.handleGlobalState)}> Create </button>
                :
                    <div>Wallets are here</div>
                    
            }        
        </div>
        )
    }

}
