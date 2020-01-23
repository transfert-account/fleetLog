import Licences from './licences';
import Vehicles from '../vehicle/vehicles';
import Societes from '../societe/societes';
import Locations from '../location/locations';
import Volumes from '../volume/volumes';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        licence(obj, {_id}, { user }){
            return Licences.find({_id:_id}).fetch() || {};
        },
        licences(obj, args){
            let licences = Licences.find().fetch() || {};
            licences.forEach((l,i) => {
                if(l.societe != null && l.societe.length > 0){
                    licences[i].societe = Societes.findOne({_id:new Mongo.ObjectID(l.societe)});
                }else{
                    licences[i].societe = {_id:"",name:""};
                }
                let vehicleId = l.vehicle
                l.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(vehicleId)});
                if(l.vehicle == null){
                    l.vehicle = Locations.findOne({_id:new Mongo.ObjectID(vehicleId)});
                }
                if(l.vehicle.volume != null && l.vehicle.volume.length > 0){
                    l.vehicle.volume = Volumes.findOne({_id:new Mongo.ObjectID(l.vehicle.volume)});
                }else{
                    l.vehicle.volume = {_id:""};
                }
            });
            return licences;
        }
    },
    Mutation:{
        addLicence(obj, {societe,number,vehicle,endDate},{user}){
            if(user._id){
                Licences.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    number:number,
                    vehicle:vehicle,
                    endDate:endDate
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
        deleteLicence(obj, {_id},{user}){
            if(user._id){
                Licences.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
        editLicence(obj, {_id,societe,number,vehicle,shiftName,endDate},{user}){
            if(user._id){
                Licences.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "number":number,
                            "vehicle":vehicle,
                            "shiftName":shiftName,
                            "endDate":endDate
                        }
                    }
                ); 
                return true;
            }
            throw new Error('Unauthorized');
        },
    }
}