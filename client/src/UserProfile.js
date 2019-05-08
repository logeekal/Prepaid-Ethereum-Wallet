import "./UserProfile.css";
import React from 'react';
import _ from 'lodash';
import * as meta from "./contracts/state.json" ;

export class UserProfile extends React.Component{
    state = this.props.state;
    constructor(props){
        super(props);
        console.log(this.state);
        
    }

    render(){
        let address = this.props.address;
        let state = this.props.state;

        console.log('printing state');
        console.log(this.state);
        console.log(_.keys(this.state.members[address]).toString());
        if(!("balance" in this.state.members[address])){
            return <div className="transient_message">Getting Balance</div>;
        }
        return(
            <div className="profile">
                <span className="profile_pic-box">
                  <img className="profile_pic" src="./img/profile.png" alt="profile" />
                </span>
                <span className="mainProfile">
                  {_.values(meta.memberProps).map((field) =>{
                    if(this.props.state.members[address][field.name] !== undefined){
                        return <p className={`mainProfile__${field.name}`}>{`${this.props.state.members[address][field.name]} ${"unit" in field ? field.unit : ""}`}</p>
                    }
                    
                  })}
                  
                </span>
            {/* <p>{_.keys(this.state.members[address]).toString()}</p> */}
            </div>
        )

    }
}