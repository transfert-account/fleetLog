import Energies from './energies.js';
import Vehicles from '../vehicle/vehicles';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        energies(obj, args){
            return Energies.find().fetch() || {};
        }
    },
    Mutation:{
        addEnergy(obj, {name},{user}){
            if(user._id){
                Energies.insert({
                    _id:new Mongo.ObjectID(),
                    name:name
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteEnergy(obj, {_id},{user}){
            if(user._id){
                let nV = Vehicles.find({energy:_id}).fetch().length
                if(nV > 0){
                    let qrm = [];
                    if(nV > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nV + ' vehicule(s) lié(s)'})}
                    return qrm;
                }else{
                    Energies.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}