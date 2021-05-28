import { Mongo } from 'meteor/mongo';
import Societes from '../societe/societes';

export const Accidents = new Mongo.Collection("accidents");

export const ACCIDENTS = user =>{
    if(new RegExp("^[0-9a-fA-F]{24}$").test(user.settings.visibility)){
        let societe = Societes.findOne({_id:new Mongo.ObjectID(user.settings.visibility)})._id._str;
        return Accidents.find({societe:societe}).fetch() || [];
    }else{
        return Accidents.find().fetch();
    }
}

export default Accidents;