import Locations from './locations.js';
import Societes from '../societe/societes.js';
import Licences from '../licence/licences.js';
import Entretiens from '../entretien/entretiens';
import Fournisseurs from '../fournisseur/fournisseurs';
import Volumes from '../volume/volumes.js';
import Brands from '../brand/brands.js';
import Models from '../model/models.js';
import Colors from '../color/colors.js';
import Equipements from '../equipement/equipements';
import EquipementDescriptions from '../equipementDescription/equipementDescriptions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        location(obj, {_id}, { user }){
            let location = Locations.findOne({_id:new Mongo.ObjectID(_id)});
            location.lastKmUpdate = location.kms[location.kms.length-1].reportDate
            location.km = location.kms[location.kms.length-1].kmValue
            if(location.payementFormat == "CRB"){
                location.property = false
            }else{
                location.property = true
            }
            location.property
            if(location.societe != null && location.societe.length > 0){
                location.societe = Societes.findOne({_id:new Mongo.ObjectID(location.societe)});
            }else{
                location.societe = {_id:""};
            }
            if(location.volume != null && location.volume.length > 0){
                location.volume = Volumes.findOne({_id:new Mongo.ObjectID(location.volume)});
            }else{
                location.volume = {_id:""};
            }
            if(location.brand != null && location.brand.length > 0){
                location.brand = Brands.findOne({_id:new Mongo.ObjectID(location.brand)});
            }else{
                location.brand = {_id:""};
            }
            if(location.model != null && location.model.length > 0){
                location.model = Models.findOne({_id:new Mongo.ObjectID(location.model)});
            }else{
                location.model = {_id:""};
            }
            if(location.color != null && location.color.length > 0){
                location.color = Colors.findOne({_id:new Mongo.ObjectID(location.color)});
            }else{
                location.color = {_id:""};
            }
            if(location.fournisseur != null && location.fournisseur.length > 0){
                location.fournisseur = Fournisseurs.findOne({_id:new Mongo.ObjectID(location.fournisseur)});
            }else{
                location.fournisseur = {_id:""};
            }
            location.equipements = Equipements.find({location:location._id._str}).fetch() || {};
            location.equipements.forEach((e,ei) => {
                e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
            });
            return location;
        },
        locations(obj, args){
            let locations = Locations.find().fetch() || {};
            locations.forEach((l,i) => {
                l.lastKmUpdate = l.kms[l.kms.length-1].reportDate
                l.km = l.kms[l.kms.length-1].kmValue
                if(l.payementFormat == "CRB"){
                    l.property = false
                }else{
                    l.property = true
                }
                if(l.volume != null && l.volume.length > 0){
                    l.volume = Volumes.findOne({_id:new Mongo.ObjectID(l.volume)});
                }else{
                    l.volume = {_id:""};
                }
                if(l.brand != null && l.brand.length > 0){
                    l.brand = Brands.findOne({_id:new Mongo.ObjectID(l.brand)});
                }else{
                    l.brand = {_id:""};
                }
                if(l.model != null && l.model.length > 0){
                    l.model = Models.findOne({_id:new Mongo.ObjectID(l.model)});
                }else{
                    l.model = {_id:""};
                }
                if(l.color != null && l.color.length > 0){
                    l.color = Colors.findOne({_id:new Mongo.ObjectID(l.color)});
                }else{
                    l.color = {_id:""};
                }
                if(l.fournisseur != null && l.fournisseur.length > 0){
                    l.fournisseur = Fournisseurs.findOne({_id:new Mongo.ObjectID(l.fournisseur)});
                }else{
                    l.fournisseur = {_id:""};
                }
                if(l.societe != null && l.societe.length > 0){
                    locations[i].societe = Societes.findOne({_id:new Mongo.ObjectID(l.societe)});
                }else{
                    locations[i].societe = {_id:""};
                }
                l.equipements = Equipements.find({location:l._id._str}).fetch() || {};
                l.equipements.forEach((e,ei) => {
                    e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
                });
            });
            return locations;
        },
        buLocations(obj,args,{ user }){
            let userFull = Meteor.users.findOne({_id:user._id});
            let locations = Locations.find({societe:userFull.settings.visibility}).fetch() || {};
            locations.forEach((l,i) => {
                l.lastKmUpdate = l.kms[l.kms.length-1].reportDate
                l.km = l.kms[l.kms.length-1].kmValue
                if(l.payementFormat == "CRB"){
                    l.property = false
                }else{
                    l.property = true
                }
                if(l.volume != null && l.volume.length > 0){
                    l.volume = Volumes.findOne({_id:new Mongo.ObjectID(l.volume)});
                }else{
                    l.volume = {_id:""};
                }
                if(l.brand != null && l.brand.length > 0){
                    l.brand = Brands.findOne({_id:new Mongo.ObjectID(l.brand)});
                }else{
                    l.brand = {_id:""};
                }
                if(l.model != null && l.model.length > 0){
                    l.model = Models.findOne({_id:new Mongo.ObjectID(l.model)});
                }else{
                    l.model = {_id:""};
                }
                if(l.color != null && l.color.length > 0){
                    l.color = Colors.findOne({_id:new Mongo.ObjectID(l.color)});
                }else{
                    l.color = {_id:""};
                }
                if(l.fournisseur != null && l.fournisseur.length > 0){
                    l.fournisseur = Fournisseurs.findOne({_id:new Mongo.ObjectID(l.fournisseur)});
                }else{
                    l.fournisseur = {_id:""};
                }
                if(l.societe != null && l.societe.length > 0){
                    locations[i].societe = Societes.findOne({_id:new Mongo.ObjectID(l.societe)});
                }else{
                    locations[i].societe = {_id:""};
                }
                l.equipements = Equipements.find({location:l._id._str}).fetch() || {};
                l.equipements.forEach((e,ei) => {
                    e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
                });
            });
            return locations;
        }
    },
    Mutation:{
        addLocation(obj, {societe,fournisseur,registration,firstRegistrationDate,km,lastKmUpdate,brand,model,volume,payload,color,insurancePaid,endDate,price,reason},{user}){
            if(user._id){
                Locations.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    fournisseur:fournisseur,
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
                    startDate:lastKmUpdate,
                    endDate:endDate,
                    price:price,
                    reason:reason,
                    reparation:0,
                    rentalContract:"",
                    archived:false,
                    archiveReason:"",
                    archiveDate:""

                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editLocation(obj, {_id,societe,fournisseur,registration,firstRegistrationDate,brand,model,volume,payload,color,insurancePaid,startDate,endDate,reason,price},{user}){
            if(user._id){
                Locations.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "fournisseur":fournisseur,
                            "registration":registration,
                            "firstRegistrationDate":firstRegistrationDate,
                            "brand":brand,
                            "model":model,
                            "volume":volume,
                            "payload":payload,
                            "color":color,
                            "insurancePaid":insurancePaid,
                            "startDate":startDate,
                            "endDate":endDate,
                            "reason":reason,
                            "price":price
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        updateLocKm(obj, {_id,date,kmValue},{user}){
            if(user._id){
                let location = Locations.findOne({_id:new Mongo.ObjectID(_id)});
                if(!moment(location.kms[location.kms.length-1].reportDate, "DD/MM/YYYY").diff(moment(date, "DD/MM/YYYY"))){
                    throw new Error("Dernier relevé plus recent");
                }
                if(location.kms[location.kms.length-1].kmValue > kmValue){
                    throw new Error("Kilométrage incohérent");
                }
                /*if(moment(location.lastKmUpdate, "DD/MM/YYYY").diff(moment())){
                    throw new Error("Date de relevé dans le futur");
                }*/
                Locations.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "lastKmUpdate":date,
                            "km":kmValue
                        }
                    }   
                )
                Locations.update(
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
        deleteLocKm(obj, {location,_id},{user}){
            if(user._id){
                Locations.update(
                    {
                        _id:new Mongo.ObjectID(location)
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
        deleteLocation(obj, {_id},{user}){
            if(user._id){
                let nL = Licences.find({vehicle:_id}).fetch().length
                let nE = Entretiens.find({vehicle:_id}).fetch().length
                let nQ = Equipements.find({vehicle:_id}).fetch().length
                if(nL + nE + nQ > 0){
                    let qrm = [];
                    if(nL > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nL + ' licence(s) liée(s)'})}
                    if(nE > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nE + ' entretien(s) lié(s)'})}
                    if(nQ > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nQ + ' equipement(s) lié(s)'})}
                    return qrm;
                }else{
                    Locations.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
        archiveLocation(obj, {_id,archiveReason},{user}){
            if(archiveReason == ""){
                archiveReason = "Aucune données"
            }
            if(user._id){
                Locations.update(
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
        unArchiveLocation(obj, {_id},{user}){
            if(user._id){
                Locations.update(
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
        },
        endOfLocation(obj, {_id,reparation,archive},{user}){
            if(user._id){
                Locations.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "reparation":reparation,
                            "archived":archive,
                            "returned":true
                        }
                    }   
                )
                return [{status:true,message:'Location retournée, montant des réparations affecté'}];
            }
            throw new Error('Unauthorized');
        },
        cancelEndOfLocation(obj, {_id},{user}){
            if(user._id){
                Locations.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "returned":false
                        }
                    }   
                )
                return [{status:true,message:'Retour de location annulé'}];
            }
            throw new Error('Unauthorized');
        }
    }
}