import './Modal.css';
import React from 'react';

export class Modal extends React.Component{
    title = "Sample Modal"
    message = "sample Message";
    status ='hidden';
    VISIBLE = 'visible';
    HIDDEN = 'hidden'
    
    
    constructor(props){
        super(props);
        
        
      
    }

    handleCloseEvent(e){
        document.getElementsByClassName('overlay')[0].style.visibility=this.HIDDEN;
        document.getElementsByClassName('modal')[0].style.visibility=this.HIDDEN;
    }


    render(){
        this.status= this.props.isOpen ? this.VISIBLE : this.HIDDEN;

    
        // console.log(`Status is ${this.status}`);
        // if(this.status == this.VISIBLE){
        //     document.getElementsByClassName('overlay')[0].style.visibility='visible';
        //     document.getElementsByClassName('modal')[0].style.visibility='visible';

        // }
        if(this.props.title != undefined){
            this.title = this.props.title;
        }

        if(this.props.message != undefined){
            this.message = this.props.message;
        }    
        return(
            [
            <div className="overlay" style={{visibility : this.status}}>
               
            </div>,
            <div className="modal" style={{visibility : this.status}}>
                <button className="modal-close" onClick={this.props.handleModalClose}>&times;</button>
                <h2>{this.title}</h2>    
                {this.props.children}
                <p className="message">{this.message}</p>
         </div>]
        );
    }
}