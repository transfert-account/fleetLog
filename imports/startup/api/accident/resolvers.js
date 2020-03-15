import Accidents from './accidents.js';
import Vehicles from '../vehicle/vehicles.js';
import Societes from '../societe/societes';
import Models from '../model/models';
import Brands from '../brand/brands';
import { Mongo } from 'meteor/mongo';

const affectData = a => {
    if(a.societe != null && a.societe.length > 0){
        a.societe = Societes.findOne({_id:new Mongo.ObjectID(a.societe)});
    }else{
        a.societe = {_id:""};
    }
    if(a.rapportExp != null && a.rapportExp.length > 0){
        a.rapportExp = Documents.findOne({_id:new Mongo.ObjectID(a.rapportExp)});
    }else{
        a.rapportExp = {_id:""};
    }
    if(a.constat != null && a.constat.length > 0){
        a.constat = Documents.findOne({_id:new Mongo.ObjectID(a.constat)});
    }else{
        a.constat = {_id:""};
    }
    if(a.vehicle != null && a.vehicle.length > 0){
        a.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(a.vehicle)});
        if(a.vehicle.brand != null && a.vehicle.brand.length > 0){
            a.vehicle.brand = Brands.findOne({_id:new Mongo.ObjectID(a.vehicle.brand)});
        }else{
            a.vehicle.brand = {_id:""};
        }
        if(a.vehicle.model != null && a.vehicle.model.length > 0){
            a.vehicle.model = Models.findOne({_id:new Mongo.ObjectID(a.vehicle.model)});
        }else{
            a.vehicle.model = {_id:""};
        }
    }else{
        a.vehicle = {_id:""};
    }
}

export default {
    Query : {
        accidents(obj, args, {user}){
            let accidents = Accidents.find({}).fetch();
            accidents.map(a=>affectData(a))
            return accidents;
        },
        buAccidents(obj, args, {user}){
            let accidents = Accidents.find({societe:user.settings.visibility}).fetch();
            accidents.map(a=>affectData(a))
            return accidents;
        }
    },
    Mutation:{
        addAccident(obj, {vehicle,occurenceDate},{user}){
            if(user._id){
                let v = Vehicles.findOne({_id:new Mongo.ObjectID(vehicle)});
                Accidents.insert({
                    _id:new Mongo.ObjectID(),
                    societe:v.societe,
                    vehicle:vehicle,
                    occurenceDate:occurenceDate,
                    description:"",
                    dateExpert:"",
                    dateTravaux:"",
                    newRapportExp:"",
                    newConstat:"",
                    constatSent:false,
                    cost:0
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editAccident(obj, {_id,occurenceDate,dateExpert,dateTravaux,constatSent,cost},{user}){
            if(user._id){
                Accidents.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "occurenceDate":occurenceDate,
                            "dateExpert":dateExpert,
                            "dateTravaux":dateTravaux,
                            "constatSent":constatSent,
                            "cost":cost
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        editDescAccident(obj, {_id,description},{user}){
            if(user._id){
                Accidents.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "description":description
                        }
                    }
                );                
                return [{status:true,message:"Description de l'accident sauvegardée"}];
            }
            throw new Error('Unauthorized');
        },
        deleteAccident(obj, {_id},{user}){
            if(user._id){
                Accidents.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}