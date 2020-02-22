import Vehicles from './vehicles.js';
import Entretiens from '../entretien/entretiens';
import Societes from '../societe/societes.js';
import Licences from '../licence/licences';
import Volumes from '../volume/volumes.js';
import Brands from '../brand/brands.js';
import Models from '../model/models.js';
import Organisms from '../organism/organisms.js';
import Colors from '../color/colors.js';
import Equipements from '../equipement/equipements';
import EquipementDescriptions from '../equipementDescription/equipementDescriptions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        vehicle(obj, {_id}, { user }){
            let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(_id)});
            vehicle.lastKmUpdate = vehicle.kms[vehicle.kms.length-1].reportDate
            vehicle.km = vehicle.kms[vehicle.kms.length-1].kmValue
            if(vehicle.payementFormat == "CRB"){
                vehicle.property = false
            }else{
                vehicle.property = true
            }
            if(vehicle.societe != null && vehicle.societe.length > 0){
                vehicle.societe = Societes.findOne({_id:new Mongo.ObjectID(vehicle.societe)});
            }else{
                vehicle.societe = {_id:""};
            }
            if(vehicle.brand != null && vehicle.brand.length > 0){
                vehicle.brand = Brands.findOne({_id:new Mongo.ObjectID(vehicle.brand)});
            }else{
                vehicle.brand = {_id:""};
            }
            if(vehicle.model != null && vehicle.model.length > 0){
                vehicle.model = Models.findOne({_id:new Mongo.ObjectID(vehicle.model)});
            }else{
                vehicle.model = {_id:""};
            }
            if(vehicle.payementOrg != null && vehicle.payementOrg.length > 0){
                vehicle.payementOrg = Organisms.findOne({_id:new Mongo.ObjectID(vehicle.payementOrg)});
            }else{
                vehicle.payementOrg = {_id:""};
            }
            if(vehicle.color != null && vehicle.color.length > 0){
                vehicle.color = Colors.findOne({_id:new Mongo.ObjectID(vehicle.color)});
            }else{
                vehicle.color = {_id:""};
            }
            if(vehicle.volume != null && vehicle.volume.length > 0){
                vehicle.volume = Volumes.findOne({_id:new Mongo.ObjectID(vehicle.volume)});
            }else{
                vehicle.volume = {_id:""};
            }
            vehicle.equipements = Equipements.find({vehicle:vehicle._id._str}).fetch() || {};
            vehicle.equipements.forEach((e,ei) => {
                e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
            });
            return vehicle;
        },
        vehicles(obj, args, { user }){
            let vehicles = Vehicles.find().fetch() || {};
            vehicles.forEach((v,i) => {
                v.lastKmUpdate = v.kms[v.kms.length-1].reportDate
                v.km = v.kms[v.kms.length-1].kmValue
                if(v.payementFormat == "CRB"){
                    v.property = false
                }else{
                    v.property = true
                }
                if(v.volume != null && v.volume.length > 0){
                    v.volume = Volumes.findOne({_id:new Mongo.ObjectID(v.volume)});
                }else{
                    v.volume = {_id:""};
                }
                if(v.societe != null && v.societe.length > 0){
                    vehicles[i].societe = Societes.findOne({_id:new Mongo.ObjectID(v.societe)});
                }else{
                    vehicles[i].societe = {_id:""};
                }
                if(v.brand != null && v.brand.length > 0){
                    v.brand = Brands.findOne({_id:new Mongo.ObjectID(v.brand)});
                }else{
                    v.brand = {_id:""};
                }
                if(v.model != null && v.model.length > 0){
                    v.model = Models.findOne({_id:new Mongo.ObjectID(v.model)});
                }else{
                    v.model = {_id:""};
                }
                if(v.payementOrg != null && v.payementOrg.length > 0){
                    v.payementOrg = Organisms.findOne({_id:new Mongo.ObjectID(v.payementOrg)});
                }else{
                    v.payementOrg = {_id:""};
                }
                if(v.color != null && v.color.length > 0){
                    v.color = Colors.findOne({_id:new Mongo.ObjectID(v.color)});
                }else{
                    v.color = {_id:""};
                }
                v.equipements = Equipements.find({vehicle:v._id._str}).fetch() || {};
                v.equipements.forEach((e,ei) => {
                    e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
                });
            });
            return vehicles;
        },
        buVehicles(obj, args,{user}){
            let userFull = Meteor.users.findOne({_id:user._id});
            let vehicles = Vehicles.find({societe:userFull.settings.visibility}).fetch() || {};
            vehicles.forEach((v,i) => {
                v.lastKmUpdate = v.kms[v.kms.length-1].reportDate
                v.km = v.kms[v.kms.length-1].kmValue
                if(v.payementFormat == "CRB"){
                    v.property = false
                }else{
                    v.property = true
                }
                if(v.volume != null && v.volume.length > 0){
                    v.volume = Volumes.findOne({_id:new Mongo.ObjectID(v.volume)});
                }else{
                    v.volume = {_id:""};
                }
                if(v.societe != null && v.societe.length > 0){
                    vehicles[i].societe = Societes.findOne({_id:new Mongo.ObjectID(v.societe)});
                }else{
                    vehicles[i].societe = {_id:""};
                }
                if(v.brand != null && v.brand.length > 0){
                    v.brand = Brands.findOne({_id:new Mongo.ObjectID(v.brand)});
                }else{
                    v.brand = {_id:""};
                }
                if(v.model != null && v.model.length > 0){
                    v.model = Models.findOne({_id:new Mongo.ObjectID(v.model)});
                }else{
                    v.model = {_id:""};
                }
                if(v.payementOrg != null && v.payementOrg.length > 0){
                    v.payementOrg = Organisms.findOne({_id:new Mongo.ObjectID(v.payementOrg)});
                }else{
                    v.payementOrg = {_id:""};
                }
                if(v.color != null && v.color.length > 0){
                    v.color = Colors.findOne({_id:new Mongo.ObjectID(v.color)});
                }else{
                    v.color = {_id:""};
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
        addVehicle(obj, {societe,registration,firstRegistrationDate,km,lastKmUpdate,brand,model,volume,payload,color,insurancePaid,payementBeginDate,purchasePrice,monthlyPayement,payementOrg,payementFormat},{user}){
            if(user._id){
                Vehicles.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    registration:registration,
                    firstRegistrationDate:firstRegistrationDate,
                    brand:brand,
                    model:model,
                    volume:volume,
                    payload:payload,
                    color:color,
                    insurancePaid:insurancePaid,
                    kms:[{
                        _id: new Mongo.ObjectID(),
                        kmValue:km,
                        reportDate:lastKmUpdate
                    }],
                    payementBeginDate:payementBeginDate,
                    purchasePrice:purchasePrice,
                    monthlyPayement:monthlyPayement,
                    payementOrg:payementOrg,
                    payementFormat:payementFormat,
                    archived:false,
                    archiveReason:"",
                    archiveDate:""
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editVehicle(obj, {_id,societe,registration,firstRegistrationDate,brand,model,volume,payload,color,insurancePaid,endDate,property,purchasePrice,payementOrg,payementBeginDate,payementFormat,monthlyPayement},{user}){
            if(user._id){
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "registration":registration,
                            "firstRegistrationDate":firstRegistrationDate,
                            "brand":brand,
                            "model":model,
                            "volume":volume,
                            "payload":payload,
                            "color":color,
                            "insurancePaid":insurancePaid,
                            "endDate":endDate,
                            "property":property,
                            "purchasePrice":purchasePrice,
                            "monthlyPayement":monthlyPayement,
                            "payementOrg":payementOrg,
                            "payementFormat":payementFormat,
                            "payementBeginDate":payementBeginDate
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        updateKm(obj, {_id,date,kmValue},{user}){
            if(user._id){
                let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(_id)});
                if(!moment(vehicle.kms[vehicle.kms.length-1].reportDate, "DD/MM/YYYY").diff(moment(date, "DD/MM/YYYY"))){
                    return [{status:false,message:'Dernier relevé plus recent'}];
                }
                if(vehicle.kms[vehicle.kms.length-1].kmValue > kmValue){
                    return [{status:false,message:'Kilométrage du dernier relevé plus élevé'}];
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
                            "km":kmValue
                        }
                    }   
                )
                Vehicles.update(
                    {
                        _id:new Mongo.ObjectID(_id)
                    },{
                        $push: {
                            "kms": {
                                _id: new Mongo.ObjectID(),
                                reportDate:date,
                                kmValue:kmValue
                            }
                        }
                    }
                )
                return [{status:true,message:'Nouveau relevé enregsitré'}];
            }
            throw new Error('Unauthorized');
        },
        deleteKm(obj, {vehicle,_id},{user}){
            if(user._id){
                Vehicles.update(
                    {
                        _id:new Mongo.ObjectID(vehicle)
                    },{
                        $pull: {
                            "kms": {
                                _id: new Mongo.ObjectID(_id)
                            }
                        }
                    }
                )
                return [{status:true,message:'Relevé supprimé'}];
            }
            throw new Error('Unauthorized');
        },
        deleteVehicle(obj, {_id},{user}){
            if(user._id){
                let nL = Licences.find({vehicle:_id}).fetch().length
                let nE = Entretiens.find({vehicle:_id}).fetch().length
                let nQ = Equipements.find({vehicle:_id}).fetch().length
                if(nL + nE + nQ > 0){
                    let qrm = [];
                    if(nL > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nL + ' licence(s) liée(s)'})}
                    if(nE > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nE + ' entretien(s) lié(s)'})}
                    if(nQ > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nQ + ' contrôle(s) lié(s)'})}
                    return qrm;
                }else{
                    Vehicles.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
        archiveVehicle(obj, {_id,archiveReason},{user}){
            if(archiveReason == ""){
                archiveReason = "Aucune données"
            }
            if(user._id){
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "archived":true,
                            "archiveReason":archiveReason,
                            "archiveDate": new Date().getDate().toString().padStart(2,0) + '/' + parseInt(new Date().getMonth()+1).toString().padStart(2,0) + '/' + new Date().getFullYear()
                        }
                    }   
                )
                return [{status:true,message:'Archivage réussi'}];
            }
            throw new Error('Unauthorized');
        },
        unArchiveVehicle(obj, {_id},{user}){
            if(user._id){
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "archived":false,
                            "archiveReason":"",
                            "archiveDate":""
                        }
                    }   
                )
                return [{status:true,message:'Désarchivage réussi'}];
            }
            throw new Error('Unauthorized');
        }
    }
}