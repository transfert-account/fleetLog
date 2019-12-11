import Vehicles from './vehicles.js';
import Societes from '../societe/societes.js';
import Equipements from '../equipement/equipements';
import EquipementDescriptions from '../equipementDescription/equipementDescriptions';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        vehicle(obj, {_id}, { user }){
            //empty of equipement
            return Vehicles.find().fetch() || {};
        },
        vehicles(obj, args){
            let vehicles = Vehicles.find().fetch() || {};
            vehicles.forEach((v,i) => {
                if(v.societe != null && v.societe.length > 0){
                    vehicles[i].societe = Societes.findOne({_id:new Mongo.ObjectID(v.societe)});
                }else{
                    vehicles[i].societe = {_id:""};
                }
                v.equipements = Equipements.find({vehicle:v._id._str}).fetch() || {};
                v.equipements.forEach((e,ei) => {
                    e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
                });
            });
            return vehicles;
        }
    },
    Mutation:{
        addVehicle(obj, {societe,registration,firstRegistrationDate,km,lastKmUpdate,brand,model,volume,payload,color,insurancePaid,endDate,property},{user}){
            if(user._id){
                Vehicles.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    registration:registration,
                    firstRegistrationDate:firstRegistrationDate,
                    km:km,
                    lastKmUpdate:lastKmUpdate,
                    brand:brand,
                    model:model,
                    volume:volume,
                    payload:payload,
                    color:color,
                    insurancePaid:insurancePaid,
                    endDate:endDate,
                    property:property
                });
                let vehicles = Vehicles.find().fetch() || {};
                vehicles.forEach((v,i) => {
                    if(v.societe != null && v.societe.length > 0){
                        vehicles[i].societe = Societes.findOne({_id:new Mongo.ObjectID(v.societe)});
                    }else{
                        vehicles[i].societe = {_id:""};
                    }
                    vehicles.equipements = Equipements.find({vehicle:v._id}).fetch() || {};
                    vehicles.equipements.forEach((e,ei) => {
                        vehicles.equipements[ei] = EquipementDescriptions.find({_id:e.equipementDescription}).fetch() || {};
                    });
                });
                return vehicles;
            }
            throw new Error('Unauthorized');
        },
        editVehicle(obj, {_id,societe,registration,firstRegistrationDate,km,lastKmUpdate,brand,model,volume,payload,color,insurancePaid,endDate,property},{user}){
            if(user._id){
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "registration":registration,
                            "firstRegistrationDate":firstRegistrationDate,
                            "km":km,
                            "lastKmUpdate":lastKmUpdate,
                            "brand":brand,
                            "model":model,
                            "volume":volume,
                            "payload":payload,
                            "color":color,
                            "insurancePaid":insurancePaid,
                            "endDate":endDate,
                            "property":property
                        }
                    }
                );                
                let vehicles = Vehicles.find().fetch() || {};
                vehicles.forEach((v,i) => {
                    if(v.societe != null && v.societe.length > 0){
                        vehicles[i].societe = Societes.findOne({_id:new Mongo.ObjectID(v.societe)});
                    }else{
                        vehicles[i].societe = {_id:""};
                    }
                    vehicles.equipements = Equipements.find({vehicle:v._id}).fetch() || {};
                    vehicles.equipements.forEach((e,ei) => {
                        vehicles.equipements[ei] = EquipementDescriptions.find({_id:e.equipementDescription}).fetch() || {};
                    });
                });
                return vehicles;
            }
            throw new Error('Unauthorized');
        },
        deleteVehicle(obj, {_id},{user}){
            if(user._id){
                Vehicles.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                let vehicles = Vehicles.find().fetch() || {};
                vehicles.forEach((v,i) => {
                    if(v.societe != null && v.societe.length > 0){
                        vehicles[i].societe = Societes.findOne({_id:new Mongo.ObjectID(v.societe)});
                    }else{
                        vehicles[i].societe = {_id:""};
                    }
                    vehicles.equipements = Equipements.find({vehicle:v._id}).fetch() || {};
                    vehicles.equipements.forEach((e,ei) => {
                        vehicles.equipements[ei] = EquipementDescriptions.find({_id:e.equipementDescription}).fetch() || {};
                    });
                });
                return vehicles;
            }
            throw new Error('Unauthorized');
        },
    }
}