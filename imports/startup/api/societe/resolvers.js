import Societes from './societes.js';
import Vehicles from '../vehicle/vehicles';
import Locations from '../location/locations';
import Licences from '../licence/licences';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        societe(obj, {_id}, { user }){
            return Societes.find().fetch() || {};
        },
        societes(obj, args){
            return Societes.find().fetch() || {};
        }
    },
    Mutation:{
        addSociete(obj, {trikey,name},{user}){
            if(user._id){
                Societes.insert({
                    _id:new Mongo.ObjectID(),
                    name:name,
                    trikey:trikey
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteSociete(obj, {_id},{user}){
            if(user._id){
                let nV = Vehicles.find({societe:_id}).fetch().length
                let nU = Meteor.users.find({"settings.visibility":_id}).fetch().length
                let nR = Locations.find({societe:_id}).fetch().length
                let nL = Licences.find({societe:_id}).fetch().length
                if(nV + nU + nR + nL > 0){
                    let qrm = [];
                    if(nV > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nV + ' véhicule(s) lié(s)'})}
                    if(nU > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nU + ' utilisateur(s) lié(s)'})}
                    if(nR > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nR + ' location(s) et  liée(s)'})}
                    if(nL > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nL + ' licence(s) liée(s)'})}
                    return qrm;
                }else{
                    Societes.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}