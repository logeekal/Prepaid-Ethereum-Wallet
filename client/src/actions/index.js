import {UPDATE_PROP} from '../action_types/index.js';

export const updateProperty = (propName,propValue) => ({
  
        "type":UPDATE_PROP,
        "payload": {
            propName,
            propValue
        }
});