import Locations from './locations.js';
import Societes from '../societe/societes.js';
import Licences from '../licence/licences.js';
import Entretiens from '../entretien/entretiens';
import Accidents from '../accident/accidents';
import Fournisseurs from '../fournisseur/fournisseurs';
import Volumes from '../volume/volumes.js';
import Brands from '../brand/brands.js';
import Models from '../model/models.js';
import Energies from '../energy/energies';
import Colors from '../color/colors.js';
import Documents from '../document/documents';
import Functions from '../common/functions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

const affectLocationData = location => {
    location.lastKmUpdate = location.kms[location.kms.length-1].reportDate
    location.km = location.kms[location.kms.length-1].kmValue
    if(location.payementFormat == "CRB"){
        location.property = false
    }else{
        location.property = true
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
    if(location.energy != null && location.energy.length > 0){
        location.energy = Energies.findOne({_id:new Mongo.ObjectID(location.energy)});
    }else{
        location.energy = {_id:""};
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
    if(location.societe != null && location.societe.length > 0){
        location.societe = Societes.findOne({_id:new Mongo.ObjectID(location.societe)});
    }else{
        location.societe = {_id:""};
    }
    if(location.cg != null && location.cg.length > 0){
        location.cg = Documents.findOne({_id:new Mongo.ObjectID(location.cg)});
    }else{
        location.cg = {_id:""};
    }
    if(location.cv != null && location.cv.length > 0){
        location.cv = Documents.findOne({_id:new Mongo.ObjectID(location.cv)});
    }else{
        location.cv = {_id:""};
    }
    if(location.contrat != null && location.contrat.length > 0){
        location.contrat = Documents.findOne({_id:new Mongo.ObjectID(location.contrat)});
    }else{
        location.contrat = {_id:""};
    }
    if(location.restitution != null && location.restitution.length > 0){
        location.restitution = Documents.findOne({_id:new Mongo.ObjectID(location.restitution)});
    }else{
        location.restitution = {_id:""};
    }
}

const affectLocationAccidents = location => {
    location.accidents = Accidents.find({vehicle:location._id._str}).fetch() || {};
    location.accidents.forEach(a => {
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
        if(a.facture != null && a.facture.length > 0){
            a.facture = Documents.findOne({_id:new Mongo.ObjectID(a.facture)});
        }else{
            a.facture = {_id:""};
        }
        if(a.questionary != null && a.questionary.length > 0){
            a.questionary = Documents.findOne({_id:new Mongo.ObjectID(a.questionary)});
        }else{
            a.questionary = {_id:""};
        }
    });
}

export default {
    Query : {
        location(obj, {_id}, { user }){
            let location = Locations.findOne({_id:new Mongo.ObjectID(_id)});
            affectLocationData(location)
            affectLocationAccidents(location)
            return location;
        },
        locations(obj, args){
            let locations = Locations.find().fetch() || {};
            locations.forEach(l => {
                affectLocationData(l)
            });
            return locations;
        },
        buLocations(obj,args,{ user }){
            let userFull = Meteor.users.findOne({_id:user._id});
            let locations = Locations.find({societe:userFull.settings.visibility}).fetch() || {};
            locations.forEach(l => {
                affectLocationData(l)
            });
            return locations;
        }
    },
    Mutation:{
        addLocation(obj, {societe,fournisseur,registration,firstRegistrationDate,km,lastKmUpdate,brand,model,energy,volume,payload,color,insurancePaid,endDate,price,reason},{user}){
            if(user._id){
                Locations.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    fournisseur:fournisseur,
                    registration:registration,
                    firstRegistrationDate:firstRegistrationDate,
                    brand:brand,
                    model:model,
                    energy:energy,
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
                    archiveDate:"",
                    cg:"",
                    cv:"",
                    contrat:"",
                    restitution:""
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editLocationIdent(obj, {_id,societe,registration,firstRegistrationDate,brand,model,energy,volume,payload,color},{user}){
            if(user._id){
                Locations.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "registration":registration,
                            "firstRegistrationDate":firstRegistrationDate,
                            "brand":brand,
                            "model":model,
                            "energy":energy,
                            "volume":volume,
                            "payload":payload,
                            "color":color
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        editLocationFinances(obj, {_id,fournisseur,insurancePaid,price,startDate,endDate,reason},{user}){
            if(user._id){
                Locations.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "fournisseur":fournisseur,
                            "insurancePaid":insurancePaid,
                            "price":price,
                            "startDate":startDate,
                            "endDate":endDate,
                            "reason":reason
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
                if(location.kms[location.kms.length-1].kmValue > kmValue){
                    throw new Error("Kilométrage incohérent");
                }
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
                if(nL + nE + nQ > 0){
                    let qrm = [];
                    if(nL > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nL + ' licence(s) liée(s)'})}
                    if(nE > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nE + ' entretien(s) lié(s)'})}
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
        },
        async uploadLocationDocument(obj, {_id,type,file,size},{user}){
            if(user._id){
                if(type != "cv" && type != "cg" && type != "contrat" && type != "restitution"){
                    return [{status:false,message:'Type de fichier innatendu (cv/cg/contrat/restitution)'}];
                }
                let location = Locations.findOne({_id:new Mongo.ObjectID(_id)});
                let societe = Societes.findOne({_id:new Mongo.ObjectID(location.societe)});
                let docId = new Mongo.ObjectID();
                return await new Promise(async (resolve,reject)=>{
                    await new Promise(async (resolve,reject)=>{
                        let uploadInfo = await Functions.shipToBucket(await file,societe,type,docId)
                        if(uploadInfo.uploadSucces){
                            resolve(uploadInfo)
                        }else{
                            reject(uploadInfo)
                        }
                    }).then((uploadInfo)=>{
                        Documents.insert({
                            _id:docId,
                            name:uploadInfo.fileInfo.docName,
                            size:size,
                            path:uploadInfo.data.Location,
                            originalFilename:uploadInfo.fileInfo.originalFilename,
                            ext:uploadInfo.fileInfo.ext,
                            mimetype:uploadInfo.fileInfo.mimetype,
                            type:type,
                            storageDate:moment().format('DD/MM/YYYY HH:mm:ss')
                        });
                        Locations.update(
                            {
                                _id: new Mongo.ObjectID(_id)
                            }, {
                                $set: {
                                    [type]:docId._str
                                }
                            }   
                        )
                        resolve(uploadInfo)
                    }).catch(e=>{
                        reject(e)
                    })
                }).then((uploadInfo)=>{
                    return [{status:true,message:'Document sauvegardé'}];
                }).catch(e=>{
                    return [{status:false,message:'Erreur durant le traitement : ' + e}];
                });
            }
        }
    }
}