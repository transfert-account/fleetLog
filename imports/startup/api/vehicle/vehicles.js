import { Mongo } from 'meteor/mongo';
import Societes from '../societe/societes';

export const Vehicles = new Mongo.Collection("vehicles");

export const VEHICLES = user =>{
    if(new RegExp("^[0-9a-fA-F]{24}$").test(user.settings.visibility)){
        let societe = Societes.findOne({_id:new Mongo.ObjectID(user.settings.visibility)})._id._str;
        return Vehicles.find({$or:[{sharedTo:societe},{societe:societe}]}).fetch() || [];
    }else{
        return Vehicles.find().fetch();
    }
}

export default Vehicles;
