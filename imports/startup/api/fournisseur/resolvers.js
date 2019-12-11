import Fournisseurs from './fournisseurs.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        fournisseurs(obj, args){
            return Fournisseurs.find().fetch() || {};
        }
    },
    Mutation:{
        addFournisseur(obj, {name},{user}){
            if(user._id){
                Fournisseurs.insert({
                    _id:new Mongo.ObjectID(),
                    name:name,
                    phone:"",
                    mail:"",
                    address:""
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
        editFournisseur(obj, {_id,name,phone,mail,address},{user}){
            if(user._id){
                Fournisseurs.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "name":name,
                            "phone":phone,
                            "mail":mail,
                            "address":address
                        }
                    }
                );                
                return true;
            }
            throw new Error('Unauthorized');
        },
        deleteFournisseur(obj, {_id},{user}){
            if(user._id){
                Fournisseurs.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
    }
}