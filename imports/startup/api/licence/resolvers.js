import Licences from './licences';
import Vehicles from '../vehicle/vehicles';
import Societes from '../societe/societes';
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
                l.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(l.vehicle)});

            });
            return licences;
        }
    },
    Mutation:{
        addLicence(obj, {societe,number,vehicle},{user}){
            if(user._id){
                Licences.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    number:number,
                    vehicle:vehicle
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
        editLicence(obj, {_id,societe,number,vehicle,shiftName},{user}){
            if(user._id){
                Licences.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "number":number,
                            "vehicle":vehicle,
                            "shiftName":shiftName
                        }
                    }
                ); 
                return true;
            }
            throw new Error('Unauthorized');
        },
    }
}