import VehicleArchiveJustifications from './vehicleArchiveJustifications.js';
import Vehicles from '../vehicle/vehicles';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        vehicleArchiveJustifications(obj, args){
            return VehicleArchiveJustifications.find().fetch() || {};
        }
    },
    Mutation:{
        addVehicleArchiveJustification(obj, {justification},{user}){
            if(user._id){
                VehicleArchiveJustifications.insert({
                    _id:new Mongo.ObjectID(),
                    justification:justification
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteVehicleArchiveJustification(obj, {_id},{user}){
            if(user._id){
                let nV = Vehicles.find({archiveJustification:_id}).fetch().length
                if(nV > 0){
                    let qrm = [];
                    if(nV > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nV + ' vehicule(s) lié(s)'})}
                    return qrm;
                }else{
                    VehicleArchiveJustifications.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}