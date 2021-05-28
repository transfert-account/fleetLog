import { Mongo } from 'meteor/mongo';
import Societes from '../societe/societes';

export const Licences = new Mongo.Collection("licences");

export const LICENCES = user =>{
    if(new RegExp("^[0-9a-fA-F]{24}$").test(user.settings.visibility)){
        let societe = Societes.findOne({_id:new Mongo.ObjectID(user.settings.visibility)})._id._str;
        return Licences.find({societe:societe}).fetch() || [];
    }else{
        return Licences.find().fetch();
    }
}

export default Licences;
