import { Mongo } from 'meteor/mongo';
import Societes from '../societe/societes';

export const Locations = new Mongo.Collection("locations");

export const LOCATIONS = user =>{
    if(new RegExp("^[0-9a-fA-F]{24}$").test(user.settings.visibility)){
        let societe = Societes.findOne({_id:new Mongo.ObjectID(user.settings.visibility)})._id._str;
        return Locations.find({societe:societe}).fetch() || [];
    }else{
        return Locations.find().fetch();
    }
}

export default Locations;
