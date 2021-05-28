import { Mongo } from 'meteor/mongo';
import Societes from '../societe/societes';

export const BatimentControls = new Mongo.Collection("batimentControls");
export const Batiments = new Mongo.Collection("batiments");//TO DELETE ONCE EMPTY IN PROD

export const BATIMENT_CONTROLS = user =>{
    if(new RegExp("^[0-9a-fA-F]{24}$").test(user.settings.visibility)){
        let societe = Societes.findOne({_id:new Mongo.ObjectID(user.settings.visibility)})._id._str;
        return BatimentControls.find({societe:societe}).fetch() || [];
    }else{
        return BatimentControls.find().fetch();
    }
}

export default BatimentControls;