import './Operations.css'
import React from 'react';
import * as meta from './contracts/state.json';
import _ from 'lodash';
import { Modal } from './components/Modal';
import App from './App';


export class Operations extends React.Component{
    state = this.props.state;
    operations = meta.operations;
    isOpen=true;
    modalState = this.props.state.modal
    
    constructor(props){
        super(props);
        console.log(this.props);
    }

    async handleOperation(e){

        //let modalState = {};
        //Setting the state to blank to wipe off previous state.
        //this is being done because if same operation is alled twice consecutively 
        //it should change the state for re-rendering.
        console.log(`Opening Modal`);
        
        this.modalState["isOpen"]="true";
        this.modalState["op"]= e.target.name;
        this.modalState["caller"] = this.props.address;
        console.log(`In handle operation ${this.props.address}`);
        //await this.setState({modal : this.modalState}, ()=> {console.log(this.state)});
        await this.props.handleGlobalState("modal",this.modalState)

    }

    componentDidUpdate(){
        console.log('Operations Component updated. State after the update is given below');
        console.log(this.props.state)
    }

    async doOperation(operation, e){
        e.preventDefault();
        
       
        //this.modalState["isOpen"] = false;
       // this.setState({modal : this.modalState            }, ()=> {console.log('After updating modal ');console.log(this.state)});
        let success= true;
        //reading owner of contract.

        // const genCallback = (addressArray)=>{
        //     return function(addressArray){contractCallback(err, res, addressArray)};
        // }

        const contractCallback = (err, res) =>{
            console.log(`Solidity Callback ${operation}`);
            console.error(err);
            if(res)alert(`Response is  ${res.toString()}`);
            if(err){
                alert(`Error is ${err.toString()}`);
               // throw err;
            }
        }

        const sendParams = {"from":this.props.address, gas:"900000",
        gasPrice : "1" };

       // const resp = await this.props.state.contract.methods.owner().send({"from":this.props.address}, 

       //Unlocking account of the transactor.
       await this.props.state.web3.eth.personal.unlockAccount(this.props.address, "welcome1", 2000,contractCallback)
      

        try{
            switch(operation){
                
                case "addMember":
                    let memberList =  {...this.props.state.members};
                    // debugger;
                    if(this.props.state.members[this.props.address].name != 'Owner'){
                        throw("Not Authorized. Sorry");
                    }
                   
                   let name = this.props.state.modal.params.name;
                   //Now we will validate if person with same name already exists
                   for (let key in memberList){
                       if(memberList[key].name === name){
                           throw `Member with Name : ${name} already exists`;
                       }
                   }
                   if(name === undefined) {
                       throw `Issue with name parameter  in ${operation}`;
                   }
                //    debugger;
                   this.props.state.web3.eth.personal.newAccount("welcome1")
                       .then((address)=>{
                            
                            memberList[address]= {
                            "name" : name,
                            "address" : address,
                            "balance" : "0",
                            "profilepic" : "./img/profile.png"
     
                         };
                        this.props.handleGlobalState("members",memberList);

                       });
                       break;
                case "sendFunds" :
                    memberList =  {...this.props.state.members};
                    let payeeAddress= this.props.state.modal.params.address;
                    let amount = this.props.state.web3.utils.toWei(this.props.state.modal.params.amount,'ether');
                    console.log(`Payee Address : ${payeeAddress} OR  Amount : ${amount}`);

                    if(payeeAddress === undefined || amount === undefined){
                        throw `Issue with either Payee Address : ${payeeAddress} OR  Amount : ${amount}`;
                    }

                    //now we will call contract message.
                    debugger;
                    this.props.state.contract.methods.sendFunds(amount,payeeAddress).send( sendParams, contractCallback);
                   // console.log(sendFundResponse);
                    if(payeeAddress in memberList){
                        let newBalance = this.props.state.web3.utils.fromWei(await this.props.state.web3.eth.getBalance(payeeAddress),'ether');
                        await this.props.handleGlobalState("members", {
                            ...this.props.state.members,
                            [payeeAddress] :{
                                ...this.props.state.members[payeeAddress],
                                "balance": newBalance
                            }
                        });
                    }
                    break;
                case "allowAccessToWallet":
                   let candidate = this.props.state.modal.params.address;
                   debugger
                   this.props.state.contract.methods.allowAccessToWallet(candidate).send(sendParams,             contractCallback);
                    debugger;
                    break;
                case 'disAllowAccessToWallet':
                    candidate = this.props.state.modal.params.address;
                    this.props.state.contract.methods.disAllowAccessToWallet(candidate).send(sendParams,
                        contractCallback );
                    break;
                case 'killWallet':
                    this.props.state.contract.methods.killWallet().send(sendParams,  contractCallback );
                    break;
                case "addFunds" :
                   let depositBalance = this.props.state.web3.utils.toWei(this.props.state.modal.params.amount,'ether');
                   this.props.state.web3.eth.sendTransaction({
                    from: this.props.address,
                    to: this.props.state.contractFacts.address, 
                    value:depositBalance,
                    gas:"900000",
                    gasPrice : "1" });     
                    break;              
            }
        }catch(err){
                
                alert(`Error is : ${err.toString()}`);
               // throw err;
            

        }

        if(success){
            
            await this.props.handleGlobalState("members", {
                ...this.props.state.members,
                [this.props.address] :{
                    ...this.props.state.members[this.props.address],
                    "message": "Success"
                }
            });
        }
        let localContractFacts= this.props.state.contractFacts;
        
    
        //let depositBalance = 
        
        try{

           
            //await this.state.contract.methods.send(depositBalance);


            console.log(`Address is ${this.props.address}`);
            let newBalance = this.props.state.web3.utils.fromWei(await this.props.state.web3.eth.getBalance(this.props.state.contractFacts.address),'ether');

            let memberBalance = this.props.state.web3.utils.fromWei(await this.props.state.web3.eth.getBalance(this.props.address),'ether');
    
            localContractFacts["balance"] = newBalance;

            // localMemberData = this.props.state.members;
            
    
            await this.props.handleGlobalState("contractFacts", localContractFacts);
            await this.props.handleGlobalState("members", {
                ...this.props.state.members,
                [this.props.address] :{
                    ...this.props.state.members[this.props.address],
                    "balance": memberBalance
                }
            });
           // debugger;
           this.modalState.params = {};
           this.closeModal();
        }catch(e){
            //debugger;
            console.error(e);
            this.closeModal();
        }
    }

    async handleParamValues(e){
        //debugger;
        this.modalState.params = {...this.modalState.params};
        this.modalState.params[e.target.name] = e.target.value;
        await this.props.handleGlobalState("modal",this.modalState);

    }

    async closeModal(){
        /**
         * 
         * CloseModal Function will make sure the 
         * a. isOpen= False;
         * b. No Params
        */
        console.log(`Closing Modal`);
        this.modalState = {
            ...this.props.state.modal,
            ["isOpen"] : false,
            ["params"] : {}
        };

        await this.props.handleGlobalState("modal", this.modalState);//.then(console.log(`Closing modal now.`));
        
    }
    
    
    
    genFields(){
        // debugger;
        console.log(`Printing address ${this.props.address}`);
        if("op" in this.props.state.modal && this.props.address === this.props.state.modal.caller){
            return (
            <Modal 
              isOpen={this.props.state.modal.isOpen}
              title={`Operation ${this.props.state.modal.op} by ${this.props.state.members[this.props.address].name}`}
              message = ""
              handleModalClose = {this.closeModal.bind(this)}
              >
            <form className="testForm">
            {_.values(this.operations[this.props.state.modal.op]["params"]).map((param) => {
                console.log(param);
                    return (<div className="op-field">
                        <label htmlFor={param.name} className="label label-op" >{param.label}</label>
                        <input 
                          id={param.name} 
                          className="field text-op"  
                          type={param.type}
                          name={param.name}
                          autoComplete="off"
                          onChange={this.handleParamValues.bind(this)}
                          />
                    </div>)
                
            })}
            <button 
                className="btn btn-do-op" 
                onClick={this.doOperation.bind(this,this.props.state.modal.op)} 
                value = {this.operations[this.props.state.modal.op].label} >
                Submit    
            </button> 
            </form>
            </Modal>)
        }else{
            return <Modal isOpen={false} ></Modal>
        
    }
}

    render(){
        return (
            <div className="ops">
            {this.genFields()}
             {_.values(this.operations).map((operation)=>{
                  return [<input type="button"
                        className={`ops__op ${operation.name} btn`}
                        name={operation.name}
                        ref={operation.name}
                        value={operation.label}
                        onClick={this.handleOperation.bind(this)}
                  />,<br/>]
              })}
            </div>
        )
    }
}