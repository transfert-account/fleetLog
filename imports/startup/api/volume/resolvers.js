import Volumes from './volumes.js';
import Locations from '../location/locations';
import Vehicles from '../vehicle/vehicles';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        volumes(obj, args){
            return Volumes.find().fetch() || {};
        }
    },
    Mutation:{
        addVolume(obj, {meterCube},{user}){
            if(user._id){
                Volumes.insert({
                    _id:new Mongo.ObjectID(),
                    meterCube:meterCube
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteVolume(obj, {_id},{user}){
            if(user._id){
                let nV = Vehicles.find({volume:_id}).fetch().length
                let nL = Locations.find({volume:_id}).fetch().length
                if(nV + nL > 0){
                    let qrm = [];
                    if(nV > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nV + ' vehicule(s) lié(s)'})}
                    if(nL > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nL + ' location(s) liée(s)'})}
                    return qrm;
                }else{
                    Volumes.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}