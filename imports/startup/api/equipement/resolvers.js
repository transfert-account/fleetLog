import Equipements from './equipements.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        equipements(obj, args){
            return Equipements.find().fetch() || {};
        }
    },
    Mutation:{
        attachEquipementToVehicle(obj, {vehicle,equipementDescription,attachementDate,lastControl},{user}){
            if(user._id){
                Equipements.insert({
                    _id:new Mongo.ObjectID(),
                    vehicle:vehicle,
                    equipementDescription:equipementDescription,
                    attachementDate:attachementDate,
                    lastControl:lastControl
                });
                return true
            }
            throw new Error('Unauthorized');
        },
        dissociateEquipement(obj, {id}, {user}){
            if(user._id){
                Equipements.remove({
                    _id:new Mongo.ObjectID(id)
                });
                return true
            }else{
                return false
            }
        }
        ,
        updateControlEquipement(obj, {id,updatedControlValue}, {user}){
            if(user._id){
                Equipements.update(
                    {
                        _id: new Mongo.ObjectID(id)
                    }, {
                        $set: {
                            "lastControl":updatedControlValue
                        }
                    }
                );  
                return true
            }else{
                return false
            }
        }
    }
}