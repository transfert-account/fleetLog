import Vehicles from './vehicles.js';
import Societes from '../societe/societes.js';
import Equipements from '../equipement/equipements';
import EquipementDescriptions from '../equipementDescription/equipementDescriptions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        vehicle(obj, {_id}, { user }){
            let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(_id)});
            if(vehicle.societe != null && vehicle.societe.length > 0){
                vehicle.societe = Societes.findOne({_id:new Mongo.ObjectID(vehicle.societe)});
            }else{
                vehicle.societe = {_id:""};
            }
            vehicle.equipements = Equipements.find({vehicle:vehicle._id._str}).fetch() || {};
            vehicle.equipements.forEach((e,ei) => {
                e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
            });
            return vehicle;
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
                    property:property,
                    kms:[]
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
        editVehicle(obj, {_id,societe,registration,firstRegistrationDate,lastKmUpdate,brand,model,volume,payload,color,insurancePaid,endDate,property},{user}){
            if(user._id){
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "registration":registration,
                            "firstRegistrationDate":firstRegistrationDate,
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
        updateKm(obj, {_id,date,kmValue},{user}){
            if(user._id){
                let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(_id)});
                if(!moment(vehicle.lastKmUpdate, "DD/MM/YYYY").diff(moment(date, "DD/MM/YYYY"))){
                    throw new Error("Dernier relevé plus recent");
                }
                if(vehicle.km > kmValue){
                    throw new Error("Kilométrage incohérent");
                }
                /*if(moment(vehicle.lastKmUpdate, "DD/MM/YYYY").diff(moment())){
                    throw new Error("Date de relevé dans le futur");
                }*/
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "lastKmUpdate":date,
                            "km":kmValue,
                        }
                    }   
                )
                Vehicles.update(
                    {
                        _id:new Mongo.ObjectID(_id)
                    },{
                        $push: {
                            "kms": {
                                reportDate:date,
                                kmValue:kmValue
                            }
                        }
                    }
                )
                return true;
            }
            throw new Error('Unauthorized');
        },
        deleteVehicle(obj, {_id},{user}){
            if(user._id){
                Vehicles.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
    }
}