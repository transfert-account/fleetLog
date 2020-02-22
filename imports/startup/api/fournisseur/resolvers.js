import Fournisseurs from './fournisseurs.js';
import Locations from '../location/locations.js';
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
                return [{status:true,message:'Création réussie'}];
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
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        deleteFournisseur(obj, {_id},{user}){
            if(user._id){
                let nL = Locations.find({fournisseur:_id}).fetch().length
                if(nL > 0){
                    let qrm = [];
                    if(nL > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nL + ' location(s) liée(s)'})}
                    return qrm;
                }else{
                    Fournisseurs.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}