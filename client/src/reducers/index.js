import getWeb3 from '../utils/getWeb3';
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import {UPDATE_PROP} from '../action_types';


 const initialState = { "web3" :{}, "accounts" :[], "contract"  :{}, "currentBalance ": "0", "members":{} };
 
  export default (state=initialState, action)=>{
      console.log("in Reducer")
      console.log(state);
      console.log(action);
      switch(action.type){
          case UPDATE_PROP:
            return {
                ...state,
                [action.payload.propName] : action.payload.propValue
            }
          default:
            return state;

      }
  }
