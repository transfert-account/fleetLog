import { Mongo } from 'meteor/mongo';
import Societes from '../societe/societes';

export const Entretiens = new Mongo.Collection("entretiens");

export const ENTRETIENS = user =>{
    if(new RegExp("^[0-9a-fA-F]{24}$").test(user.settings.visibility)){
        let societe = Societes.findOne({_id:new Mongo.ObjectID(user.settings.visibility)})._id._str;
        return Entretiens.find({societe:societe}).fetch() || [];
    }else{
        return Entretiens.find().fetch();
    }
}

export default Entretiens;
