import Entretiens from '../entretien/entretiens'
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        testThis(obj, args,{user}){
            Entretiens.remove({})
            return "true";
        }
    }
}